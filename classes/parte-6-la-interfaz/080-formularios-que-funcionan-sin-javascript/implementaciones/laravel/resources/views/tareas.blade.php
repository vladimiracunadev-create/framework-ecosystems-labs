<!DOCTYPE html>
<html><body>
{{-- Un formulario HTML de verdad: `method="post"`, `action` a una ruta del
     servidor y un `<input name>`. Sin una línea de JavaScript, el navegador
     ya sabe recogerlo, codificarlo y enviarlo.

     `@csrf` pinta el campo oculto con el testigo de la clase 072. Va el
     PRIMERO del formulario: es la pieza que un formulario real nunca omite. --}}
<form method="post" action="/tareas">
  @csrf
  <input name="titulo" value="">
  <button type="submit">Crear</button>
</form>

<ul>
@foreach ($tareas as $tarea)
  <li data-id="{{ $tarea['id'] }}">{{ $tarea['titulo'] }}</li>
@endforeach
</ul>
</body></html>
