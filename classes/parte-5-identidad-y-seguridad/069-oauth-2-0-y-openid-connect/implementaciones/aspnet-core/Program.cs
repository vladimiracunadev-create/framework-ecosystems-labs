using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

// Un servidor de autorizacion MINIMO: codigo de autorizacion + PKCE. En
// produccion no se escribe uno; este existe para que cada defensa del
// protocolo sea medible paso a paso.
var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

var clave = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes("clave-de-firma-solo-para-el-laboratorio"));
var manejador = new JsonWebTokenHandler();

// La redirect_uri se registra POR ADELANTADO: la peticion debe traer
// exactamente la registrada, o un atacante pediria el codigo a su servidor.
var clientes = new Dictionary<string, string>
{
    ["cliente-demo"] = "https://app.example/callback",
};

// Codigo → lo que hara falta al canjearlo. Un solo uso; en produccion,
// ademas, caduca en minutos.
var codigos = new Dictionary<string, Emision>();

string TokenAleatorio()
{
    var bytes = RandomNumberGenerator.GetBytes(24);
    return Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');
}

string ResumenS256(string verificador)
{
    var digesto = SHA256.HashData(Encoding.UTF8.GetBytes(verificador));
    return Convert.ToBase64String(digesto).TrimEnd('=').Replace('+', '-').Replace('/', '_');
}

app.MapGet("/autorizar", (HttpContext contexto) =>
{
    var q = contexto.Request.Query;
    var clienteId = q["client_id"].FirstOrDefault() ?? "";

    // Cliente desconocido o redirect_uri no registrada: error DIRECTO, sin
    // redirigir — redirigir a una URI no verificada seria un open redirect.
    if (!clientes.TryGetValue(clienteId, out var registrada)
        || q["redirect_uri"].FirstOrDefault() != registrada)
    {
        return Results.Json(new { error = "invalid_request" }, statusCode: 400);
    }

    // Aqui iria login y consentimiento; el laboratorio los salta con un
    // usuario fijo porque lo que mide es la mecanica del codigo y de PKCE.
    var estado = q["state"].FirstOrDefault();
    var consulta = new List<string>();

    // Sin PKCE no hay codigo. La redirect_uri SI esta verificada, asi que
    // el error viaja de vuelta al cliente con el state intacto.
    var reto = q["code_challenge"].FirstOrDefault() ?? "";
    if (q["response_type"].FirstOrDefault() != "code" || reto.Length == 0
        || q["code_challenge_method"].FirstOrDefault() != "S256")
    {
        consulta.Add("error=invalid_request");
    }
    else
    {
        var codigo = TokenAleatorio();
        codigos[codigo] = new Emision(reto, registrada, clienteId, false);
        consulta.Add($"code={codigo}");
    }
    // El state vuelve TAL CUAL: es el testigo anti-CSRF del cliente.
    if (estado is not null)
    {
        consulta.Add($"state={Uri.EscapeDataString(estado)}");
    }
    return Results.Redirect($"{registrada}?{string.Join("&", consulta)}");
});

app.MapPost("/token", async (HttpContext contexto) =>
{
    // Formulario, no JSON: lo dice la especificacion del endpoint de token.
    var f = await contexto.Request.ReadFormAsync();
    var codigo = f["code"].FirstOrDefault() ?? "";
    var entrada = codigos.TryGetValue(codigo, out var encontrada) ? encontrada : null;

    var invalido = f["grant_type"].FirstOrDefault() != "authorization_code"
        || entrada is null
        || entrada.Usado
        || entrada.Cliente != f["client_id"].FirstOrDefault()
        || entrada.Redireccion != f["redirect_uri"].FirstOrDefault();

    // PKCE: el resumen del verificador de ahora tiene que casar con el reto
    // del principio. Solo quien inicio el flujo tiene el verificador.
    var resumen = ResumenS256(f["code_verifier"].FirstOrDefault() ?? "");

    if (invalido || resumen != entrada!.Reto)
    {
        if (entrada is not null)
        {
            codigos[codigo] = entrada with { Usado = true };
        }
        return Results.Json(new { error = "invalid_grant" }, statusCode: 400);
    }

    codigos[codigo] = entrada with { Usado = true };

    var idToken = manejador.CreateToken(new SecurityTokenDescriptor
    {
        Issuer = "http://laboratorio.local",
        Audience = f["client_id"].FirstOrDefault(),
        Claims = new Dictionary<string, object> { ["sub"] = "ana" },
        Expires = DateTime.UtcNow.AddHours(1),
        SigningCredentials = new SigningCredentials(clave, SecurityAlgorithms.HmacSha256),
    });

    return Results.Json(new
    {
        access_token = TokenAleatorio(),
        token_type = "Bearer",
        expires_in = 3600,
        id_token = idToken,
    });
});

app.Run();

record Emision(string Reto, string Redireccion, string Cliente, bool Usado);
