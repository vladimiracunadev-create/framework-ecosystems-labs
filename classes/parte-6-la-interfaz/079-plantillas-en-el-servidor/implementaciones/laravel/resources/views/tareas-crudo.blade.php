{{-- `{!! !!}` es la puerta cruda de Blade. El símbolo de admiración es la
     advertencia: se lee distinto y se teclea distinto que la vía normal. --}}
<ul>
@foreach ($tareas as $tarea)
  <li data-id="{{ $tarea['id'] }}">{!! $tarea['titulo'] !!}</li>
@endforeach
</ul>
