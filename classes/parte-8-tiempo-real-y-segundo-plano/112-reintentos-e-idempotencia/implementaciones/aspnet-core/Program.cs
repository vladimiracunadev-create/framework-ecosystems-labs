using System.Collections.Concurrent;

// REINTENTAR SIN CAUSAR DAÑO, CON ASP.NET CORE.
//
// .NET tiene la mejor pieza de los cuatro para la mitad de reintentar: la
// biblioteca de resiliencia —lo que antes se llamaba Polly— con espera creciente,
// fluctuación, tope y cortacircuitos, todo declarado. Está tan integrada que
// `AddStandardResilienceHandler` te la pone en un cliente HTTP con una línea.
//
// Y no toca la otra mitad. Reintentar bien reparte el daño mejor; **lo que lo
// evita es que reintentar no haga nada la segunda vez**, y eso no lo puede
// resolver ninguna biblioteca de cliente: la clave la tiene que poner quien pide,
// porque solo él sabe si dos peticiones son el mismo intento.
//
// Aquí los reintentos van escritos a mano, al lado de la idempotencia, para que
// se vea que son dos cosas distintas y que solo una arregla el problema.

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

// Los cobros hechos.
var cobros = new List<Cobro>();

// LA MEMORIA DE CLAVES, QUE ES TODA LA IDEA.
//
// Guarda, por clave, **la respuesta que ya se dio**. No basta con recordar «esta
// clave ya pasó»: hay que devolver lo mismo, porque quien reintenta necesita el
// identificador del cobro tanto como el primero. Y tiene que caducar.
var claves = new ConcurrentDictionary<string, Cobro>();

int[] esperasMs = [50, 100, 200];

app.MapPost("/cobros", (HttpContext contexto, CuerpoDelCobro? cuerpo) =>
{
    var clave = contexto.Request.Headers["Idempotency-Key"].ToString();
    var importe = cuerpo?.Importe ?? 30;

    // SIN CLAVE NO HAY NADA QUE HACER. El servidor no puede distinguir un
    // reintento de un cobro nuevo, y tiene que cobrar. Es correcto.
    if (!string.IsNullOrEmpty(clave) && claves.TryGetValue(clave, out var anterior))
    {
        return Results.Json(new { anterior.Id, anterior.Importe, anterior.Estado, repetida = true });
    }

    Cobro cobro;
    lock (cobros)
    {
        cobro = new Cobro($"cobro-{cobros.Count + 1}", importe, "cobrado");
        cobros.Add(cobro);
    }
    if (!string.IsNullOrEmpty(clave)) claves[clave] = cobro;

    return Results.Json(
        new { cobro.Id, cobro.Importe, cobro.Estado, repetida = false },
        statusCode: 201);
});

app.MapGet("/cobros", () =>
{
    lock (cobros)
    {
        return Results.Json(new
        {
            cobros_totales = cobros.Count,
            importe_total = cobros.Sum(c => c.Importe),
            cobros,
        });
    }
});

app.MapGet("/idempotencia.json", async (HttpContext contexto) =>
{
    var origen = $"http://{contexto.Request.Host}";
    using var cliente = new HttpClient();

    async Task Cobrar(string? clave)
    {
        var peticion = new HttpRequestMessage(HttpMethod.Post, $"{origen}/cobros")
        {
            Content = JsonContent.Create(new { importe = 30 }),
        };
        if (clave is not null) peticion.Headers.TryAddWithoutValidation("Idempotency-Key", clave);
        await cliente.SendAsync(peticion);
    }

    async Task<int> Totales()
    {
        var resumen = await cliente.GetFromJsonAsync<Resumen>($"{origen}/cobros");
        return resumen!.Cobros_totales;
    }

    lock (cobros) cobros.Clear();
    claves.Clear();
    for (var i = 0; i < 3; i++) await Cobrar("k-prueba");
    var conClave = await Totales();

    lock (cobros) cobros.Clear();
    claves.Clear();
    for (var i = 0; i < 3; i++) await Cobrar(null);
    var sinClave = await Totales();

    // LOS REINTENTOS, con espera creciente y un tope. Una operación que falla
    // las dos primeras veces y funciona a la tercera: el caso normal de un
    // proveedor con un mal rato, no de uno roto.
    var intentosDeLaOperacion = 0;
    string? Intentar()
    {
        intentosDeLaOperacion++;
        if (intentosDeLaOperacion < 3) throw new InvalidOperationException("el proveedor no contesta");
        return "hecho";
    }

    var intentos = 0;
    string? resultado = null;
    foreach (var espera in new[] { 0 }.Concat(esperasMs))
    {
        if (espera > 0) await Task.Delay(espera);
        intentos++;
        try
        {
            resultado = Intentar();
            break;
        }
        catch (InvalidOperationException)
        {
            resultado = null;
        }
    }

    return Results.Json(new
    {
        framework = "aspnet-core",
        con_clave_peticiones = 3,
        con_clave_cobros = conClave,
        sin_clave_peticiones = 3,
        sin_clave_cobros = sinClave,
        la_clave_evita_el_duplicado = conClave == 1 && sinClave == 3,
        reintentos = intentos,
        exito_tras_reintentos = resultado == "hecho",
        esperas_ms = esperasMs,
        la_espera_crece = true,
        donde_se_guarda_la_clave = "un diccionario en memoria; en produccion, una tabla con indice unico",
        que_hace_falta_para_que_valga =
            "guardar la RESPUESTA y no solo la clave, y ponerle caducidad: sin lo primero el "
            + "reintento se queda sin identificador, sin lo segundo la tabla crece para siempre",
        que_no_se_debe_reintentar =
            "lo que devuelve 4xx: un 400 no mejora por repetirlo; la biblioteca de resiliencia "
            + "deja declarar que se reintenta y que no",
    });
});

app.Run();

public record Cobro(string Id, int Importe, string Estado);
public record CuerpoDelCobro(int? Importe);
public record Resumen(int Cobros_totales, int Importe_total);
