{{-- Las llaves dobles de Blade ESCAPAN: compilan a htmlspecialchars. Blade
     no interpreta la plantilla en cada petición — la COMPILA a PHP una vez y
     cachea el resultado, que es por lo que el escapado no cuesta nada. --}}
<ul>
@foreach ($tareas as $tarea)
  <li data-id="{{ $tarea['id'] }}">{{ $tarea['titulo'] }}</li>
@endforeach
</ul>
