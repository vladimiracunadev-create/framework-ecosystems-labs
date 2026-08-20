var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

// El nombre entre llaves y el del parámetro coinciden: ASP.NET Core los empareja.
app.MapGet("/tareas/{id}", (string id) => Results.Json(new { id }));

app.Run();
