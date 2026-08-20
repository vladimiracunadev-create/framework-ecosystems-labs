var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

// Los nombres de los ayudantes dicen exactamente lo que hacen: `permanent` y
// `preserveMethod` son los dos ejes de una redirección.
app.MapGet("/antigua", () => Results.Redirect("/nueva", permanent: true));
app.MapGet("/temporal", () => Results.Redirect("/nueva", permanent: false));
app.MapPost("/temporal-estricta",
    () => Results.Redirect("/nueva", permanent: false, preserveMethod: true));

app.MapGet("/nueva", () => Results.Json(new { destino = "nueva" }));
app.MapPost("/nueva", () => Results.Json(new { destino = "nueva", metodo = "POST" }));

app.Run();
