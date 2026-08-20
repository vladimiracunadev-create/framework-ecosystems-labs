<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/tareas', function (Request $peticion) {
    // `json_decode` sobre el contenido crudo: `$peticion->json()` devolvería una
    // colección vacía ante un cuerpo ilegible, sin distinguirlo de uno vacío.
    $cuerpo = json_decode($peticion->getContent(), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return response()->json(['error' => 'cuerpo JSON mal formado'], 400);
    }

    $titulo = is_array($cuerpo) ? ($cuerpo['titulo'] ?? null) : null;
    if (!is_string($titulo) || $titulo === '') {
        return response()->json(['error' => 'titulo es obligatorio'], 422);
    }

    return response()->json(['id' => '1', 'titulo' => $titulo, 'completada' => false], 201);
});
