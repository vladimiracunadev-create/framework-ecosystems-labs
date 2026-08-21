using System.Text.Json;
using System.Text.Json.Serialization;

// Los dos ficheros de datos/ son DATOS congelados, no software instalado: el
// árbol de una aplicación de 2017 y una instantánea de la base de avisos.
// Este laboratorio no instala bibliotecas vulnerables — audita datos sobre
// ellas, que es lo que hace un auditor de verdad.
var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

var opciones = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
var raiz = AppContext.BaseDirectory;
var arbol = JsonSerializer.Deserialize<Arbol>(
    File.ReadAllText(Path.Combine(raiz, "datos", "arbol.json")), opciones)!;
var baseAvisos = JsonSerializer.Deserialize<BaseAvisos>(
    File.ReadAllText(Path.Combine(raiz, "datos", "avisos.json")), opciones)!;

// Comparación NUMÉRICA de versiones, componente a componente.
//
// Comparar versiones como texto es el error que convierte una auditoría en
// un tranquilizante: "2.5.9" > "2.5.10" es CIERTO alfabéticamente, así que
// una comparación textual declararía sana una versión afectada. Un
// componente que falta cuenta como cero: 2.5.10 < 2.5.10.1.
static bool MenorQue(string a, string b)
{
    var pa = a.Split('.');
    var pb = b.Split('.');
    for (var i = 0; i < Math.Max(pa.Length, pb.Length); i++)
    {
        var x = i < pa.Length ? int.Parse(pa[i]) : 0;
        var y = i < pb.Length ? int.Parse(pb[i]) : 0;
        if (x != y) return x < y;
    }
    return false;
}

app.MapGet("/dependencias", () =>
    // El número que sorprende la primera vez: lo que declaras y lo que
    // ejecutas no son la misma lista.
    Results.Json(new
    {
        directas = arbol.Paquetes.Count(p => p.Directa),
        total = arbol.Paquetes.Count,
        paquetes = arbol.Paquetes.Select(p => p.Nombre),
    }));

app.MapGet("/dependencias/{nombre}", (string nombre) =>
{
    var paquete = arbol.Paquetes.FirstOrDefault(p => p.Nombre == nombre);
    return paquete is null
        ? Results.Json(new { error = "no-esta-en-el-arbol" }, statusCode: 404)
        : Results.Json(new
        {
            nombre = paquete.Nombre,
            version = paquete.Version,
            directa = paquete.Directa,
            traida_por = paquete.Traida_Por,
        });
});

app.MapGet("/auditoria", (string? version) =>
{
    // `?version=` permite preguntar «¿y si actualizo?» sin tocar el árbol.
    var hallazgos = new List<object>();
    foreach (var aviso in baseAvisos.Avisos)
    {
        var paquete = arbol.Paquetes.FirstOrDefault(p => p.Nombre == aviso.Paquete);
        if (paquete is null) continue;
        var instalada = string.IsNullOrEmpty(version) ? paquete.Version : version;
        if (!MenorQue(instalada, aviso.Fijada_En)) continue;
        hallazgos.Add(new
        {
            id = aviso.Id,
            paquete = paquete.Nombre,
            instalada,
            fijada_en = aviso.Fijada_En,
            gravedad = aviso.Gravedad,
            // Si es transitiva, la actualización no se hace sobre ella sino
            // sobre quien la trajo.
            directa = paquete.Directa,
            traida_por = paquete.Traida_Por,
            explotada_activamente = aviso.Explotada_Activamente,
        });
    }
    return Results.Json(new
    {
        instantanea = baseAvisos.Instantanea,
        avisos_conocidos = baseAvisos.Avisos.Count,
        afectadas = hallazgos.Count,
        hallazgos,
    });
});

app.Run();

class Arbol
{
    [JsonPropertyName("paquetes")]
    public List<Paquete> Paquetes { get; set; } = [];
}

class Paquete
{
    [JsonPropertyName("nombre")]
    public string Nombre { get; set; } = "";

    [JsonPropertyName("version")]
    public string Version { get; set; } = "";

    [JsonPropertyName("directa")]
    public bool Directa { get; set; }

    [JsonPropertyName("traida_por")]
    public List<string> Traida_Por { get; set; } = [];
}

class BaseAvisos
{
    [JsonPropertyName("instantanea")]
    public string Instantanea { get; set; } = "";

    [JsonPropertyName("avisos")]
    public List<Aviso> Avisos { get; set; } = [];
}

class Aviso
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = "";

    [JsonPropertyName("paquete")]
    public string Paquete { get; set; } = "";

    [JsonPropertyName("fijada_en")]
    public string Fijada_En { get; set; } = "";

    [JsonPropertyName("gravedad")]
    public string Gravedad { get; set; } = "";

    [JsonPropertyName("explotada_activamente")]
    public bool Explotada_Activamente { get; set; }
}
