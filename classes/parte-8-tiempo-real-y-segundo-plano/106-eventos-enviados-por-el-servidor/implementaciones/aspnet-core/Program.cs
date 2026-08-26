using System.Text;

// EVENTOS ENVIADOS POR EL SERVIDOR CON ASP.NET CORE.
//
// Aquí no hay un tipo `SseResult` ni nada parecido: se escribe en
// `Response.Body` y se vacía el buffer a mano con `FlushAsync`. Esa llamada es la
// que más importa de todo el archivo, y es la que se olvida: sin ella, el
// servidor acumula los tres eventos y los manda juntos al cerrar, con lo que el
// flujo deja de ser un flujo y pasa a ser una descarga lenta.
//
// El resto —el formato de cuatro reglas, la reanudación con `Last-Event-ID`— es
// idéntico en los cuatro frameworks, porque no es del framework: es del estándar.

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

// Los eventos que hay que entregar. Cada uno tiene un número de orden, y ese
// número es lo que permite reanudar.
var pedidos = new[]
{
    new { id = 1, cliente = "Ada", importe = 32 },
    new { id = 2, cliente = "Grace", importe = 18 },
    new { id = 3, cliente = "Alan", importe = 47 },
};

// EL FORMATO, QUE SON CUATRO REGLAS Y NINGUNA MÁS. Cada evento es un bloque de
// líneas `campo: valor` terminado en UNA LÍNEA EN BLANCO. Olvidarla es el error
// número uno: el navegador se queda esperando y no entrega nada.
string ComoEvento(int id, string cliente, int importe) =>
    $"id: {id}\nevent: pedido\ndata: {{\"id\":{id},\"cliente\":\"{cliente}\",\"importe\":{importe}}}\n\n";

app.MapGet("/eventos", async (HttpContext contexto) =>
{
    contexto.Response.ContentType = "text/event-stream; charset=utf-8";
    contexto.Response.Headers.CacheControl = "no-cache";
    contexto.Response.Headers.Connection = "keep-alive";
    // Sin esta, un nginx delante guarda la respuesta en un buffer y no entrega
    // nada hasta que se llena. Es el fallo clásico de esta tecnología y solo
    // aparece en producción.
    contexto.Response.Headers["X-Accel-Buffering"] = "no";

    // Cuánto debe esperar el navegador antes de reconectar si esto se corta.
    await contexto.Response.WriteAsync("retry: 2000\n\n");
    await contexto.Response.Body.FlushAsync();

    // LA REANUDACIÓN, QUE ES LA MITAD DE LA CLASE. El navegador manda esta
    // cabecera solo, sin que nadie lo programe, con el identificador del último
    // evento que recibió.
    var cabecera = contexto.Request.Headers["Last-Event-ID"].ToString();
    var ultimo = int.TryParse(cabecera, out var n) ? n : 0;

    foreach (var pedido in pedidos)
    {
        if (pedido.id > ultimo)
        {
            await contexto.Response.WriteAsync(ComoEvento(pedido.id, pedido.cliente, pedido.importe));
            await contexto.Response.Body.FlushAsync();
        }
    }

    // El flujo se cierra a propósito al acabarse los eventos, para que el
    // contrato pueda leerlo entero. Uno real se quedaría abierto emitiendo un
    // comentario —`: latido`— cada treinta segundos.
});

app.MapGet("/sse.json", async (HttpContext contexto) =>
{
    var origen = $"http://{contexto.Request.Host}";
    using var cliente = new HttpClient();
    var flujo = await cliente.GetAsync($"{origen}/eventos");
    var texto = await flujo.Content.ReadAsStringAsync();

    return Results.Json(new
    {
        framework = "aspnet-core",
        tipo_de_contenido = flujo.Content.Headers.ContentType?.ToString() ?? "",
        eventos_recibidos = texto.Split("event: ").Length - 1,
        bytes_del_flujo = Encoding.UTF8.GetByteCount(texto),
        es_unidireccional = true,
        reconecta_solo_el_navegador = true,
        cabecera_de_reanudacion = "Last-Event-ID",
        como_se_declara =
            "escribiendo en Response.Body y vaciando el buffer a mano con FlushAsync",
        que_cuesta =
            "una conexion abierta por cliente; el modelo asincrono no ocupa un hilo mientras espera",
        el_fallo_clasico =
            "olvidar FlushAsync: los eventos se acumulan y llegan juntos al cerrar",
    });
});

app.Run();
