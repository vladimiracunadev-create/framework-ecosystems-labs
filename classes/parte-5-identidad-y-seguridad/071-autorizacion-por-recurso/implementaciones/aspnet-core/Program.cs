using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

// Los DOS usuarios tienen el mismo rol: una politica por rol los deja pasar
// a los dos. La pregunta de esta clase —¿es tuyo ESTE dato?— no se responde
// con RequireRole: se responde en la consulta, con el propietario en la
// condicion.
var constructor = WebApplication.CreateBuilder(args);
constructor.Services
    .AddAuthentication("Basic")
    .AddScheme<AuthenticationSchemeOptions, ManejadorBasico>("Basic", null);
constructor.Services.AddAuthorization();

var app = constructor.Build();
app.UseAuthentication();
app.UseAuthorization();

var tareas = new Dictionary<string, Tarea>
{
    ["1"] = new("1", "preparar informe", "ana"),
    ["2"] = new("2", "revisar contrato", "luis"),
};

// Buscar SIEMPRE con el propietario en la condicion: para este usuario, la
// tarea ajena directamente NO SE ENCUENTRA. En SQL:
// WHERE id = @id AND propietaria = @usuario
Tarea? Buscar(string id, string usuario) =>
    tareas.TryGetValue(id, out var tarea) && tarea.Propietaria == usuario ? tarea : null;

app.MapGet("/tareas", (ClaimsPrincipal actual) =>
    {
        var mias = tareas.Values.Where(t => t.Propietaria == actual.Identity!.Name).ToList();
        return Results.Json(new { total = mias.Count, tareas = mias });
    })
    .RequireAuthorization();

app.MapGet("/tareas/{id}", (string id, ClaimsPrincipal actual) =>
    {
        var tarea = Buscar(id, actual.Identity!.Name!);
        // 404 y no 403: un 403 confirmaria que la tarea EXISTE, y los
        // identificadores son enumerables.
        return tarea is null
            ? Results.Json(new { error = "no-encontrada" }, statusCode: 404)
            : Results.Json(tarea);
    })
    .RequireAuthorization();

app.MapDelete("/tareas/{id}", (string id, ClaimsPrincipal actual) =>
    {
        var tarea = Buscar(id, actual.Identity!.Name!);
        if (tarea is null)
        {
            return Results.Json(new { error = "no-encontrada" }, statusCode: 404);
        }
        tareas.Remove(tarea.Id);
        return Results.StatusCode(204);
    })
    .RequireAuthorization();

app.Run();

// Los nombres en minúscula del contrato salen de la política camelCase que
// las APIs mínimas aplican por omisión al serializar.
record Tarea(string Id, string Titulo, string Propietaria);

class ManejadorBasico(
    IOptionsMonitor<AuthenticationSchemeOptions> opciones,
    ILoggerFactory registro,
    UrlEncoder codificador) : AuthenticationHandler<AuthenticationSchemeOptions>(opciones, registro, codificador)
{
    private static readonly Dictionary<string, string> Usuarios = new()
    {
        ["ana"] = "secreta123",
        ["luis"] = "secreta123",
    };

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var cabecera = Request.Headers.Authorization.FirstOrDefault();
        if (cabecera is null || !cabecera.StartsWith("Basic "))
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }
        string texto;
        try
        {
            texto = Encoding.UTF8.GetString(Convert.FromBase64String(cabecera["Basic ".Length..]));
        }
        catch (FormatException)
        {
            return Task.FromResult(AuthenticateResult.Fail("cabecera malformada"));
        }
        var partes = texto.Split(':', 2);
        if (partes.Length != 2 || !Usuarios.TryGetValue(partes[0], out var clave)
            || clave != partes[1])
        {
            return Task.FromResult(AuthenticateResult.Fail("credenciales invalidas"));
        }
        var identidad = new ClaimsIdentity(
            [new Claim(ClaimTypes.Name, partes[0])], Scheme.Name);
        return Task.FromResult(AuthenticateResult.Success(
            new AuthenticationTicket(new ClaimsPrincipal(identidad), Scheme.Name)));
    }

    protected override Task HandleChallengeAsync(AuthenticationProperties propiedades)
    {
        Response.Headers.WWWAuthenticate = "Basic realm=\"laboratorio\"";
        return base.HandleChallengeAsync(propiedades);
    }
}
