<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// El almacén de la clase: un fichero, porque el servidor embebido de PHP
// atiende cada petición en un proceso nuevo y una variable no sobreviviría.
function almacen(): string
{
    return __DIR__ . '/../storage/tareas.json';
}

function leer(): array
{
    return file_exists(almacen())
        ? json_decode(file_get_contents(almacen()), true) ?: []
        : [];
}

Route::get('/tareas', fn () => view('tareas', ['tareas' => leer()]));

Route::post('/tareas', function (Request $peticion) {
    $tareas = leer();
    $tareas[] = ['id' => (string) (count($tareas) + 1), 'titulo' => $peticion->input('titulo', '')];
    file_put_contents(almacen(), json_encode($tareas));

    // ENVIAR, REDIRIGIR, MOSTRAR. La respuesta al POST no es la página: es un
    // 302 a la página. Sin esto, recargar reenvía el formulario.
    return redirect('/tareas');
});
