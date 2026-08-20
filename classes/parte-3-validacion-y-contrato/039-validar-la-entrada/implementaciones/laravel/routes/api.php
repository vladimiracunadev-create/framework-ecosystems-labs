<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/tareas', function (Request $peticion) {
    // `validate` es la respuesta de Laravel: una línea con las reglas, y si algo
    // falla lanza una excepción que el manejador de arriba convierte en 422.
    $datos = $peticion->validate([
        'titulo' => ['required', 'string', 'min:1', 'max:120'],
        'completada' => ['sometimes', 'boolean'],
    ]);

    return response()->json([
        'titulo' => trim($datos['titulo']),
        'completada' => $datos['completada'] ?? false,
    ], 201);
});
