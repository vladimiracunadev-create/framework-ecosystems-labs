using System.Text.Json.Serialization;

var constructor = WebApplication.CreateBuilder(args);

// La sesion de ASP.NET Core guarda en el servidor (aqui, una cache en memoria;
// en produccion, una distribuida) y a la cookie solo viaja el identificador,
// protegido con Data Protection. Los atributos no son decoracion: HttpOnly la
// esconde del script de la pagina y SameSite=Lax evita que viaje en
// peticiones provocadas desde otra pagina.
constructor.Services.AddDistributedMemoryCache();
constructor.Services.AddSession(opciones =>
{
    opciones.Cookie.Name = "sesion";
    opciones.Cookie.HttpOnly = true;
    opciones.Cookie.SameSite = SameSiteMode.Lax;
    opciones.Cookie.Path = "/";
    // Sin esto, la cookie queda sujeta a la politica de consentimiento y el
    // middleware puede decidir no emitirla.
    opciones.Cookie.IsEssential = true;
});

var app = constructor.Build();
app.UseSession();

var usuarios = new Dictionary<string, string> { ["ana"] = "secreta123" };

app.MapPost("/entrar", (Credenciales? credenciales, HttpContext contexto) =>
{
    var usuario = credenciales?.Usuario ?? "";
    if (!usuarios.TryGetValue(usuario, out var clave) || clave != (credenciales?.Clave ?? ""))
    {
        return Results.Json(new { error = "credenciales-invalidas" }, statusCode: 401);
    }

    // Un identificador que traiga el cliente sin haberlo emitido este servidor
    // no descifra, asi que el middleware genera uno nuevo: el identificador
    // fijado por un atacante no queda autenticado.
    contexto.Session.SetString("usuario", usuario);
    return Results.Json(new { usuario });
});

app.MapGet("/perfil", (HttpContext contexto) =>
{
    var usuario = contexto.Session.GetString("usuario");
    return usuario is null
        ? Results.Json(new { error = "no-autenticado" }, statusCode: 401)
        : Results.Json(new { usuario });
});

app.MapPost("/salir", (HttpContext contexto) =>
{
    // Dos gestos, y hacen falta los dos: `Clear` vacia la sesion en el
    // servidor (la cookie robada deja de valer) y `Cookies.Delete` le pide al
    // navegador que tire la suya. Borrar solo la cookie dejaria los datos
    // vivos en el almacen.
    contexto.Session.Clear();
    contexto.Response.Cookies.Delete("sesion", new CookieOptions { Path = "/" });
    return Results.StatusCode(204);
});

app.Run();

class Credenciales
{
    [JsonPropertyName("usuario")]
    public string? Usuario { get; set; }

    [JsonPropertyName("clave")]
    public string? Clave { get; set; }
}
