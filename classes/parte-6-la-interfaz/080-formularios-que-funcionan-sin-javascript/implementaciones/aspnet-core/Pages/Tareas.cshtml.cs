using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

public class TareasModel : PageModel
{
    public record Tarea(string Id, string Titulo);

    public static readonly List<Tarea> Tareas = [];

    public void OnGet()
    {
    }

    public IActionResult OnPost(string? titulo)
    {
        Tareas.Add(new Tarea((Tareas.Count + 1).ToString(), titulo ?? ""));
        // ENVIAR, REDIRIGIR, MOSTRAR. La respuesta al POST no es la página:
        // es una redirección a la página. Sin esto, recargar reenvía el
        // formulario y crea otra tarea.
        return RedirectToPage();
    }
}
