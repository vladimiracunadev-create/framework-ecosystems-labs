<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// El estado vive en un archivo porque el servidor de desarrollo de PHP atiende
// cada petición en un proceso nuevo: sin esto, cada llamada empezaría de cero.
// Es un detalle del modelo de ejecución de PHP, no de Laravel.
function almacen(): string
{
    return sys_get_temp_dir() . '/clase-014-laravel.json';
}

function leer(): array
{
    $ruta = almacen();
    if (!file_exists($ruta)) {
        return ['tareas' => ['1' => ['id' => '1', 'titulo' => 'original']], 'altas' => 0];
    }
    return json_decode((string) file_get_contents($ruta), true) ?: [];
}

function guardar(array $estado): void
{
    file_put_contents(almacen(), json_encode($estado));
}

Route::get('/tareas/{id}', function (string $id) {
    $estado = leer();
    if (!isset($estado['tareas'][$id])) {
        return response('', 404);
    }
    return response()->json($estado['tareas'][$id]);
});

Route::put('/tareas/{id}', function (Request $peticion, string $id) {
    $estado = leer();
    $tarea = ['id' => $id, 'titulo' => (string) $peticion->input('titulo', '')];
    $estado['tareas'][$id] = $tarea;
    guardar($estado);
    return response()->json($tarea);
});

Route::post('/tareas', function (Request $peticion) {
    $estado = leer();
    $estado['altas'] = ($estado['altas'] ?? 0) + 1;
    $id = 'nueva-' . $estado['altas'];
    $estado['tareas'][$id] = ['id' => $id, 'titulo' => (string) $peticion->input('titulo', '')];
    guardar($estado);
    return response()->json(['id' => $id, 'altas' => $estado['altas']], 201)
        ->header('Location', '/tareas/' . $id);
});
