// EL DOMINIO.
//
// Este archivo no usa Entity Framework, ni ASP.NET Core, ni nada que sepa de
// bases de datos. Es C# corriente, y por eso las reglas de más abajo se pueden
// ejecutar en una prueba en milisegundos — sin servidor, sin esquema y sin
// limpiar tablas entre casos.
//
// La ruta `/dominio` lo lee y comprueba, SOBRE SUS `using`, que esa afirmación
// es cierta. Prometerlo en un README no cuesta nada; comprobarlo, sí.

namespace Labs.Dominio;

class ReglaRota(string codigo) : Exception(codigo)
{
    public string Codigo { get; } = codigo;
}

class Tarea(long id, string titulo, bool hecha = false)
{
    public long Id { get; } = id;
    public string Titulo { get; set; } = titulo;
    public bool Hecha { get; private set; } = hecha;

    public void Terminar() => Hecha = true;
}

/// <summary>
/// El proyecto es la RAÍZ: nadie toca una tarea sin pasar por él.
///
/// Esa es la razón de que las tres reglas puedan vivir aquí. Si el resto del
/// código pudiera añadir tareas por su cuenta, «no se añaden tareas a un
/// proyecto cerrado» sería una recomendación en lugar de una regla.
/// </summary>
class Proyecto(long id, string nombre, bool cerrado = false, List<Tarea>? tareas = null)
{
    public long Id { get; } = id;
    public string Nombre { get; set; } = nombre;
    public bool Cerrado { get; private set; } = cerrado;
    public List<Tarea> Tareas { get; } = tareas ?? [];

    /// <summary>REGLA 2 y REGLA 3.</summary>
    public Tarea AnadirTarea(long idTarea, string titulo)
    {
        if (Cerrado) throw new ReglaRota("PROYECTO_CERRADO");
        if (Tareas.Any(t => t.Titulo == titulo)) throw new ReglaRota("TITULO_REPETIDO");

        var tarea = new Tarea(idTarea, titulo);
        Tareas.Add(tarea);
        return tarea;
    }

    /// <summary>REGLA 1.</summary>
    public void Cerrar()
    {
        if (Pendientes() > 0) throw new ReglaRota("QUEDAN_PENDIENTES");
        Cerrado = true;
    }

    public Tarea TerminarTarea(long idTarea)
    {
        var tarea = Tareas.FirstOrDefault(t => t.Id == idTarea)
            ?? throw new ReglaRota("NO_EXISTE");
        tarea.Terminar();
        return tarea;
    }

    public int Pendientes() => Tareas.Count(t => !t.Hecha);

    public object Salida() => new
    {
        id = (int)Id,
        nombre = Nombre,
        cerrado = Cerrado,
        tareas = Tareas.Count,
        pendientes = Pendientes(),
    };
}

/// <summary>Lo único que el dominio necesita. Cuatro métodos, y ninguno menciona SQL.</summary>
interface IRepositorio
{
    Task<Proyecto?> PorIdAsync(long id);
    Task<Proyecto> GuardarAsync(Proyecto proyecto);
    Task<long> SiguienteIdProyectoAsync();
    Task<long> SiguienteIdTareaAsync();
}

/// <summary>Para las pruebas. Un diccionario y dos contadores.</summary>
class RepositorioEnMemoria : IRepositorio
{
    private readonly Dictionary<long, Proyecto> proyectos = [];
    private long siguienteProyecto = 1;
    private long siguienteTarea = 1;

    public Task<Proyecto?> PorIdAsync(long id) =>
        Task.FromResult(proyectos.TryGetValue(id, out var p) ? p : null);

    public Task<Proyecto> GuardarAsync(Proyecto proyecto)
    {
        proyectos[proyecto.Id] = proyecto;
        return Task.FromResult(proyecto);
    }

    public Task<long> SiguienteIdProyectoAsync() => Task.FromResult(siguienteProyecto++);

    public Task<long> SiguienteIdTareaAsync() => Task.FromResult(siguienteTarea++);
}
