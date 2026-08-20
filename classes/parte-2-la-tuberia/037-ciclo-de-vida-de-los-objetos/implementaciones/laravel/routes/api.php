<?php

use Illuminate\Support\Facades\Route;

Route::get('/ambitos', function (ServicioUnico $unico, ServicioPorPeticion $porPeticion) {
    return response()->json(['unico' => $unico->id, 'porPeticion' => $porPeticion->id]);
});
