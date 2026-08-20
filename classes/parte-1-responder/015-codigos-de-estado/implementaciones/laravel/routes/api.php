<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

function almacen(): string
{
    return sys_get_temp_dir() . '/clase-015-laravel.json';
}

function leer(): array
{
    $ruta = almacen();
    if (!file_exists($ruta)) {
        return ['tareas' => ['1' => ['id' => '1', 'titulo' => 'original']], 'siguiente' => 100];
    }
    return json_decode((string) file_get_contents($ruta), true) ?: [];
}

function guardar(array $estado): void
{
    file_put_contents(almacen(), json_encode($estado));
}

Route::post('/tareas', function (Request $peticion) {
    $estado = leer();
    $id = (string) $estado['siguiente'];
    $estado['siguiente'] = $estado['siguiente'] + 1;
    $estado['tareas'][$id] = ['id' => $id, 'titulo' => (string) $peticion->input('titulo', '')];
    guardar($estado);

    return response()->json(['id' => $id], 201)->header('Location', '/tareas/' . $id);
});

Route::delete('/tareas/{id}', function (string $id) {
    $estado = leer();
    if (!isset($estado['tareas'][$id])) {
        return response()->json(['error' => 'no existe'], 404);
    }
    unset($estado['tareas'][$id]);
    guardar($estado);

    // `response()->noContent()` garantiza un 204 sin cuerpo.
    return response()->noContent();
});

Route::get('/tareas/{id}', function (string $id) {
    $estado = leer();
    if (!isset($estado['tareas'][$id])) {
        return response()->json(['error' => 'no existe'], 404);
    }

    return response()->json($estado['tareas'][$id]);
});
