using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

var constructor = WebApplication.CreateBuilder(args);

// El reparto de papeles de ASP.NET Core: la AUTENTICACION es enchufable (un
// esquema Basic escrito aqui mismo, porque el framework no trae uno) y la
// AUTORIZACION es del framework — politicas con nombre que las rutas piden.
constructor.Services
    .AddAuthentication("Basic")
    .AddScheme<AuthenticationSchemeOptions, ManejadorBasico>("Basic", null);
constructor.Services.AddAuthorization(opciones =>
{
    opciones.AddPolicy("administradora", politica => politica.RequireRole("admin"));
});

var app = constructor.Build();
app.UseAuthentication();
app.UseAuthorization();

var tareas = new Dictionary<string, object>
{
    ["1"] = new { id = "1", titulo = "preparar informe" },
    ["2"] = new { id = "2", titulo = "revisar contrato" },
};

app.MapGet("/panel", (ClaimsPrincipal actual) =>
        Results.Json(new { usuario = actual.Identity!.Name, rol = "admin" }))
    .RequireAuthorization("administradora");

// Sin politica: basta estar autenticado. El lector lee.
app.MapGet("/tareas", () => Results.Json(new { total = tareas.Count }))
    .RequireAuthorization();

app.MapDelete("/tareas/{id}", (string id) =>
    {
        tareas.Remove(id);
        return Results.StatusCode(204);
    })
    .RequireAuthorization("administradora");

app.Run();

class ManejadorBasico(
    IOptionsMonitor<AuthenticationSchemeOptions> opciones,
    ILoggerFactory registro,
    UrlEncoder codificador) : AuthenticationHandler<AuthenticationSchemeOptions>(opciones, registro, codificador)
{
    private static readonly Dictionary<string, (string Clave, string Rol)> Usuarios = new()
    {
        ["ana"] = ("secreta123", "admin"),
        ["luis"] = ("secreta123", "lector"),
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
        if (partes.Length != 2 || !Usuarios.TryGetValue(partes[0], out var registrado)
            || registrado.Clave != partes[1])
        {
            // 401 desde el esquema: no sabemos quien eres.
            return Task.FromResult(AuthenticateResult.Fail("credenciales invalidas"));
        }
        var identidad = new ClaimsIdentity(
            [new Claim(ClaimTypes.Name, partes[0]), new Claim(ClaimTypes.Role, registrado.Rol)],
            Scheme.Name);
        return Task.FromResult(AuthenticateResult.Success(
            new AuthenticationTicket(new ClaimsPrincipal(identidad), Scheme.Name)));
    }

    protected override Task HandleChallengeAsync(AuthenticationProperties propiedades)
    {
        // El desafio del 401: sin esta cabecera, el cliente no sabe como
        // autenticarse. El 403 (Forbid) no la lleva — ya sabemos quien es.
        Response.Headers.WWWAuthenticate = "Basic realm=\"laboratorio\"";
        return base.HandleChallengeAsync(propiedades);
    }
}
