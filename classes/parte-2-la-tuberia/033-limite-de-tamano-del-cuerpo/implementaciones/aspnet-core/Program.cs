using System.Text.Json;

var constructor = WebApplication.CreateBuilder(args);

// Kestrel aplica su propio limite de cuerpo, muy por encima del nuestro. Se
// baja aqui para que la defensa este en la capa de servidor, antes del codigo.
constructor.WebHost.ConfigureKestrel(opciones =>
{
    opciones.Limits.MaxRequestBodySize = 1024;
});

var app = constructor.Build();

app.MapPost("/tareas", async (HttpRequest peticion) =>
{
    try
    {
        var cuerpo = await JsonSerializer.DeserializeAsync<JsonElement>(peticion.Body);
        return Results.Json(new { bytes = JsonSerializer.Serialize(cuerpo).Length },
            statusCode: 201);
    }
    catch (Microsoft.AspNetCore.Http.BadHttpRequestException)
    {
        return Results.Json(
            new { type = "about:blank", title = "cuerpo demasiado grande",
                  status = 413, code = "CUERPO_EXCEDIDO" },
            statusCode: 413, contentType: "application/problem+json");
    }
    catch (JsonException)
    {
        return Results.Json(new { error = "cuerpo JSON mal formado" }, statusCode: 400);
    }
});

app.Run();
