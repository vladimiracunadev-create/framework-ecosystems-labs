<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// El mismo contrato, en Laravel. El almacén va en un fichero porque el servidor
// embebido de PHP atiende cada petición en un PROCESO NUEVO: una variable
// estática no sobreviviría de una petición a la siguiente, y el contrato de esta
// clase encadena seis peticiones.
//
// Ese detalle no es una rareza del laboratorio: es el modelo de ejecución de
// PHP, y explica por qué en este ecosistema la sesión y la caché son piezas de
// infraestructura desde el primer día.

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

function escribir(array $tareas): void
{
    file_put_contents(almacen(), json_encode($tareas));
}

Route::get('/tareas', function () {
    $tareas = array_values(leer());

    return response()->json(['total' => count($tareas), 'tareas' => $tareas]);
});

Route::post('/tareas', function (Request $peticion) {
    $tareas = leer();
    $id = (string) (count($tareas) + 1);
    $tarea = ['id' => $id, 'titulo' => (string) $peticion->input('titulo', '')];
    $tareas[$id] = $tarea;
    escribir($tareas);

    // FUERA DE LA OMISIÓN (1): `json()` responde 200. El 201 y el Location se
    // encadenan a mano; nada en la API los ata entre sí.
    return response()->json($tarea, 201)->header('Location', "/tareas/{$id}");
});

Route::get('/tareas/{id}', function (string $id) {
    $tareas = leer();
    // FUERA DE LA OMISIÓN (2): el 404 por omisión de Laravel es una página HTML
    // —la misma que ve un navegador—, así que el contrato obliga a interceptar.
    if (! isset($tareas[$id])) {
        return response()->json(['error' => 'no-encontrada'], 404);
    }

    return response()->json($tareas[$id]);
});

Route::delete('/tareas/{id}', function (string $id) {
    $tareas = leer();
    if (! isset($tareas[$id])) {
        return response()->json(['error' => 'no-encontrada'], 404);
    }
    unset($tareas[$id]);
    escribir($tareas);

    // FUERA DE LA OMISIÓN (3): `noContent()` existe y devuelve 204 sin cuerpo.
    return response()->noContent();
});
