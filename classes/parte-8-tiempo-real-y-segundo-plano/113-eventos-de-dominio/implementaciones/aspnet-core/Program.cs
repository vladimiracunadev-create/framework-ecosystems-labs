using System.Collections.Concurrent;

// EVENTOS DE DOMINIO CON ASP.NET CORE.
//
// .NET no trae bus de eventos de dominio en el framework web. Lo que hay es un
// contenedor de dependencias muy bueno, y con él la forma idiomática de montar
// esto: **registrar varios servicios que implementan la misma interfaz** y pedir
// la colección entera. `IEnumerable<IConsumidor>` inyecta a todos los que haya
// registrados, y añadir uno nuevo es una línea en el arranque.
//
// Es un bus de eventos con otro nombre, y tiene una ventaja concreta sobre el
// diccionario de funciones de Express o FastAPI: cada consumidor es un tipo, con
// sus propias dependencias inyectadas. Y una desventaja simétrica: hay que
// declararlo en el arranque, no basta con escribirlo.
//
// Para lo que aquí no hace falta —despachar por tipo de mensaje, encadenar
// comportamientos— el ecosistema tiene MediatR, que es una biblioteca de
// terceros y la respuesta habitual.

var constructor = WebApplication.CreateBuilder(args);

var estado = new Estado();
constructor.Services.AddSingleton(estado);

// LOS DOS CONSUMIDORES, INDEPENDIENTES. Ninguno sabe del otro, y el alta no sabe
// de ninguno: solo publica.
constructor.Services.AddSingleton<IConsumidor>(new Bienvenida(estado));
constructor.Services.AddSingleton<IConsumidor>(new Estadisticas(estado));
constructor.Services.AddSingleton<IConsumidor>(new Roto(estado));

var app = constructor.Build();

// PUBLICAR: avisar a todos, y que el fallo de uno no arrastre a los demás.
//
// El `try` de dentro del bucle es la línea más importante del archivo. Sin él, el
// primer consumidor que reviente deja sin ejecutar a los siguientes y devuelve el
// error a quien publicó — es decir, rompe el alta por culpa de un correo.
void Publicar(IEnumerable<IConsumidor> consumidores, Usuario usuario)
{
    estado.Fallidos.Clear();
    foreach (var consumidor in consumidores)
    {
        try
        {
            consumidor.Al(usuario);
        }
        catch (Exception)
        {
            estado.Fallidos.Add(consumidor.Nombre);
        }
    }
}

app.MapPost("/usuarios", (CuerpoDelAlta? cuerpo, IEnumerable<IConsumidor> consumidores) =>
{
    var usuario = new Usuario(estado.Usuarios.Count + 1, cuerpo?.Nombre ?? "sin nombre");
    estado.Usuarios.Add(usuario);
    // El alta hace lo suyo y anuncia lo que pasó. No sabe quién escucha.
    Publicar(consumidores, usuario);
    return Results.Json(usuario, statusCode: 201);
});

app.MapGet("/efectos", () => Results.Json(new
{
    usuarios = estado.Usuarios.Count,
    correos_enviados = estado.Correos.Count,
    altas_contadas = estado.AltasContadas,
    correos = estado.Correos,
    consumidores_fallidos = estado.Fallidos,
}));

app.MapGet("/eventos.json", async (HttpContext contexto) =>
{
    var origen = $"http://{contexto.Request.Host}";
    using var cliente = new HttpClient();

    async Task<(int Correos, int Altas)> Efectos()
    {
        var e = await cliente.GetFromJsonAsync<ResumenDeEfectos>($"{origen}/efectos");
        return (e!.Correos_enviados, e.Altas_contadas);
    }

    async Task<int> Alta(string nombre)
    {
        var r = await cliente.PostAsJsonAsync($"{origen}/usuarios", new { nombre });
        return (int)r.StatusCode;
    }

    estado.ElRotoEstaActivo = false;
    estado.Reiniciar();
    await Alta("Ada");
    var conLosDos = await Efectos();

    // UN CONSUMIDOR ROTO NO ROMPE A LOS DEMÁS NI A QUIEN PUBLICÓ.
    estado.ElRotoEstaActivo = true;
    estado.Reiniciar();
    var estadoDelAlta = await Alta("Grace");
    var conUnoRoto = await Efectos();

    estado.ElRotoEstaActivo = false;
    estado.Reiniciar();
    await Alta("Alan");
    var sinElRoto = await Efectos();

    return Results.Json(new
    {
        framework = "aspnet-core",
        consumidores = 2,
        los_dos_reaccionaron = conLosDos.Correos == 1 && conLosDos.Altas == 1,
        un_consumidor_roto_no_rompe_a_los_demas = conUnoRoto.Correos == 1 && conUnoRoto.Altas == 1,
        la_peticion_no_falla = estadoDelAlta == 201,
        quitar_un_consumidor_no_toca_al_emisor = sinElRoto.Correos == 1 && sinElRoto.Altas == 1,
        el_emisor_no_conoce_a_los_consumidores = true,
        como_se_publica = "recorriendo IEnumerable<IConsumidor>, que el contenedor inyecta entero",
        como_se_suscribe = "registrando otro IConsumidor en el arranque: una linea",
        es_sincrono = true,
        que_pasa_si_un_consumidor_falla =
            "se captura y se sigue; el fallo se PIERDE, y para reintentarlo el evento "
            + "tendria que estar guardado en algun sitio",
        que_haria_falta_en_produccion =
            "guardar el evento antes de publicarlo, para poder reintentar al consumidor que fallo",
    });
});

app.Run();

public interface IConsumidor
{
    string Nombre { get; }
    void Al(Usuario usuario);
}

public class Bienvenida(Estado estado) : IConsumidor
{
    public string Nombre => "bienvenida";
    public void Al(Usuario usuario) => estado.Correos.Add($"bienvenida a {usuario.Nombre}");
}

public class Estadisticas(Estado estado) : IConsumidor
{
    public string Nombre => "estadisticas";
    public void Al(Usuario usuario) => estado.AltasContadas++;
}

/// <summary>El tercero, que revienta a propósito cuando está activo.</summary>
public class Roto(Estado estado) : IConsumidor
{
    public string Nombre => "roto";
    public void Al(Usuario usuario)
    {
        if (!estado.ElRotoEstaActivo) return;
        throw new InvalidOperationException("este consumidor esta roto");
    }
}

public class Estado
{
    public List<Usuario> Usuarios { get; } = [];
    public List<string> Correos { get; } = [];
    public int AltasContadas { get; set; }
    public ConcurrentBag<string> Fallidos { get; } = [];
    public bool ElRotoEstaActivo { get; set; }

    public void Reiniciar()
    {
        Usuarios.Clear();
        Correos.Clear();
        AltasContadas = 0;
        Fallidos.Clear();
    }
}

public record Usuario(int Id, string Nombre);
public record CuerpoDelAlta(string? Nombre);
public record ResumenDeEfectos(int Usuarios, int Correos_enviados, int Altas_contadas);
