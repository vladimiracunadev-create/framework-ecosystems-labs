using Microsoft.AspNetCore.ResponseCompression;

var constructor = WebApplication.CreateBuilder(args);

constructor.Services.AddResponseCompression(opciones =>
{
    // Por omisión .NET no comprime sobre HTTPS, para evitar ataques que
    // aprovechan el tamaño de la respuesta comprimida. Aquí se sirve por HTTP.
    opciones.EnableForHttps = false;
    opciones.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] { "text/plain" });
});

var app = constructor.Build();
app.UseResponseCompression();

var largo = string.Concat(Enumerable.Repeat("tarea pendiente. ", 400));

app.MapGet("/grande", () => Results.Text(largo, "text/plain"));
app.MapGet("/pequeno", () => Results.Text("corto", "text/plain"));

app.Run();
