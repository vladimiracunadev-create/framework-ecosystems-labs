// Razor Pages: la pieza de ASP.NET Core para páginas con formularios. Dos
// cosas vienen puestas sin pedirlas, y las dos son esta clase: el ayudante de
// formulario inyecta el testigo antiforgery como campo oculto, y todo POST a
// una página lo VALIDA por omisión — el envío sin testigo se rechaza sin que
// ninguna línea de esta aplicación lo pida.
var constructor = WebApplication.CreateBuilder(args);
constructor.Services.AddRazorPages();

var app = constructor.Build();
app.MapRazorPages();
app.Run();
