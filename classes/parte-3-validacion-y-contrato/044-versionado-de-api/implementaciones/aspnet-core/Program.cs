var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

var persona = new { id = "1", nombre = "Ada", apellido = "Lovelace" };
object ComoV1() => new { id = "1", nombre = "Ada Lovelace" };

// (1) VERSION EN LA RUTA. Un grupo por version mantiene el codigo separado.
var v1 = app.MapGroup("/v1");
var v2 = app.MapGroup("/v2");

v1.MapGet("/personas/1", () => Results.Json(ComoV1()));
v2.MapGet("/personas/1", () => Results.Json(persona));

// (2) VERSION EN LA CABECERA.
app.MapGet("/personas/1", (HttpRequest peticion, HttpResponse respuesta) =>
{
    var version = peticion.Headers["X-Api-Version"].FirstOrDefault() ?? "1";
    respuesta.Headers["X-Api-Version"] = version;

    return version switch
    {
        "2" => Results.Json(persona),
        "1" => Results.Json(ComoV1()),
        _ => Results.Json(new { code = "VERSION_DESCONOCIDA" }, statusCode: 400),
    };
});

app.Run();
