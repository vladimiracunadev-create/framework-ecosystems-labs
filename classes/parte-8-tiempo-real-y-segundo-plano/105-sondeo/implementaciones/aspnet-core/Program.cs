using System.Text;

// SONDEO CON ASP.NET CORE.
//
// El detalle propio de esta implementación está en cómo se devuelve el 304.
// `Results.Json(...)` siempre lleva cuerpo y siempre lleva 200, así que para
// decir «no hay nada nuevo» hay que bajar al `HttpContext` y escribir la
// cabecera a mano. Es la misma incomodidad que en FastAPI y por el mismo motivo:
// **el camino cómodo de un framework de API es devolver datos**, y aquí lo que
// hace falta es devolver la ausencia de ellos.
//
// ASP.NET tiene además un middleware de caché de respuesta —`ResponseCaching`—
// que sabe de `ETag` y de `If-None-Match`. No se usa aquí para que la
// comparación sea de la misma cosa en los cuatro, pero conviene saber que
// existe.

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

// El estado que se sondea. La versión sube en cada cambio.
var version = 1;
var valor = "tres pedidos";

// El identificador de la versión actual, entre comillas como pide HTTP.
string Marca() => $"\"v{version}\"";

app.MapGet("/estado", (HttpContext contexto) =>
{
    var actual = Marca();
    var siNoCoincide = contexto.Request.Headers.IfNoneMatch.ToString();

    // LA CONDICIÓN, QUE ES TODA LA CLASE. Si quien pregunta ya tiene esta
    // versión, se le dice que no hay nada nuevo: 304, sin cuerpo.
    if (siNoCoincide == actual)
    {
        contexto.Response.Headers.ETag = actual;
        return Results.StatusCode(StatusCodes.Status304NotModified);
    }

    contexto.Response.Headers.ETag = actual;
    // `no-cache` no significa «no guardes»: significa «guárdalo, pero pregunta
    // antes de usarlo».
    contexto.Response.Headers.CacheControl = "no-cache";
    return Results.Json(new { version, valor });
});

app.MapPost("/cambiar", () =>
{
    version += 1;
    valor = $"{version + 2} pedidos";
    return Results.Json(new { version, valor });
});

// UNA SESIÓN DE SONDEO, MEDIDA POR EL PROPIO SERVIDOR.
//
// Seis preguntas: cinco sin novedad y una con ella. Es la proporción real de
// cualquier sondeo —casi todas las preguntas sobran— y es la razón de que el
// condicional importe tanto.
app.MapGet("/sondeo.json", async (HttpContext contexto) =>
{
    var origen = $"http://{contexto.Request.Host}";
    const int intervalo = 50;
    using var cliente = new HttpClient();

    var primera = await cliente.GetAsync($"{origen}/estado");
    var etiqueta = primera.Headers.ETag?.ToString() ?? "";

    var sinCambios = 0;
    var bytesSinCambios = 0;
    for (var i = 0; i < 5; i++)
    {
        await Task.Delay(intervalo);
        var peticion = new HttpRequestMessage(HttpMethod.Get, $"{origen}/estado");
        peticion.Headers.TryAddWithoutValidation("If-None-Match", etiqueta);
        var r = await cliente.SendAsync(peticion);
        if ((int)r.StatusCode == 304)
        {
            sinCambios += 1;
            bytesSinCambios += Encoding.UTF8.GetByteCount(await r.Content.ReadAsStringAsync());
        }
    }

    await cliente.PostAsync($"{origen}/cambiar", null);
    var ultima = new HttpRequestMessage(HttpMethod.Get, $"{origen}/estado");
    ultima.Headers.TryAddWithoutValidation("If-None-Match", etiqueta);
    var conNovedad = await cliente.SendAsync(ultima);
    var cuerpo = await conNovedad.Content.ReadAsStringAsync();

    return Results.Json(new
    {
        framework = "aspnet-core",
        intervalo_ms = intervalo,
        sondeos = 6,
        sin_cambios = sinCambios,
        con_cambios = (int)conNovedad.StatusCode == 200 ? 1 : 0,
        peticiones_desperdiciadas = sinCambios,
        bytes_de_cuerpo_sin_cambios = bytesSinCambios,
        bytes_de_cuerpo_con_cambios = Encoding.UTF8.GetByteCount(cuerpo),
        el_dato_llega_con_un_retraso_de_hasta_ms = intervalo,
        como_se_declara_el_etag =
            "bajando al HttpContext: Results.Json siempre lleva cuerpo y siempre lleva 200",
        que_no_arregla_el_condicional =
            "la ida y vuelta ocurre igual: se ahorra el cuerpo, no la peticion ni la latencia",
        cuando_conviene =
            "cuando el retraso aceptable se mide en segundos y no en milisegundos, que es casi siempre",
    });
});

app.Run();
