var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

app.MapGet("/", () => Results.Text("hola", "text/plain"));

app.Run();
