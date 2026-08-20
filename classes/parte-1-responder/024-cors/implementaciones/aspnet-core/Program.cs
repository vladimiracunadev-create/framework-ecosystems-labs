var constructor = WebApplication.CreateBuilder(args);

constructor.Services.AddCors(opciones =>
{
    opciones.AddPolicy("permitidos", politica => politica
        .WithOrigins("https://permitido.example")
        .WithMethods("GET", "POST")
        .WithHeaders("content-type", "x-token")
        .SetPreflightMaxAge(TimeSpan.FromSeconds(600)));
});

var app = constructor.Build();
app.UseCors("permitidos");

app.MapGet("/datos", () => Results.Json(new { ok = true }));

app.Run();
