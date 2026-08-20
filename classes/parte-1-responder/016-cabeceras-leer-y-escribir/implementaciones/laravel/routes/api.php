<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/eco', function (Request $peticion) {
    $recibido = $peticion->header('X-Peticion', '(ninguna)');
    $respuesta = response()->json(['recibido' => $recibido]);
    $respuesta->headers->set('X-Respuesta', 'servida');
    $respuesta->headers->set('Cache-Control', 'no-store', true);

    return $respuesta;
});
