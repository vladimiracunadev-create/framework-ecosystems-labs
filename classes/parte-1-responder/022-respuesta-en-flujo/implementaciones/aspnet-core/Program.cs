using System.Text;

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

app.MapGet("/flujo", async (HttpResponse respuesta) =>
{
    respuesta.ContentType = "text/plain";
    respuesta.Headers.CacheControl = "no-store";

    foreach (var trozo in new[] { "uno\n", "dos\n", "tres\n" })
    {
        await respuesta.Body.WriteAsync(Encoding.UTF8.GetBytes(trozo));
        // Sin el vaciado explícito, el búfer podría enviarlo todo junto al
        // final: la respuesta sería correcta y ya no sería un flujo.
        await respuesta.Body.FlushAsync();
        await Task.Delay(50);
    }
});

app.Run();
