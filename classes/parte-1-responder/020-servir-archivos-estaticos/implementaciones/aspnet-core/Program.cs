using Microsoft.Extensions.FileProviders;

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.ContentRootPath, "publico")),
    RequestPath = "/estatico",
    OnPrepareResponse = contexto =>
    {
        contexto.Context.Response.Headers.CacheControl = "public, max-age=3600";
    },
});

app.Run();
