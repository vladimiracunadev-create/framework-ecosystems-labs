var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

const long limite = 1024;

app.MapPost("/subir", async (HttpRequest peticion) =>
{
    if (!peticion.HasFormContentType)
    {
        return Results.Json(new { error = "falta el archivo" }, statusCode: 422);
    }

    var formulario = await peticion.ReadFormAsync();
    var archivo = formulario.Files["archivo"];
    if (archivo is null || archivo.Length == 0)
    {
        return Results.Json(new { error = "falta el archivo" }, statusCode: 422);
    }
    if (archivo.Length > limite)
    {
        return Results.Json(new { error = "archivo demasiado grande" }, statusCode: 413);
    }

    return Results.Json(new { nombre = archivo.FileName, bytes = archivo.Length }, statusCode: 201);
});

app.Run();
