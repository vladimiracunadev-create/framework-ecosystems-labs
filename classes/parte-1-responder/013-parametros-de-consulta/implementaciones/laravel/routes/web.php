<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/tareas', function (Request $peticion) {
    $bruto = $peticion->query('limite');

    if ($bruto === null) {
        return response()->json(['limite' => 20]);
    }

    // ctype_digit sobre la cadena original: (int) convertiría "abc" en 0 en
    // silencio, que es justo la clase de conversión que hay que evitar.
    if (!ctype_digit((string) $bruto)) {
        return response()->json(['error' => 'limite debe ser un entero entre 1 y 100'], 422);
    }

    $limite = (int) $bruto;
    if ($limite < 1 || $limite > 100) {
        return response()->json(['error' => 'limite debe ser un entero entre 1 y 100'], 422);
    }

    return response()->json(['limite' => $limite]);
});
