<?php

use Illuminate\Support\Facades\Route;

// El contenedor lee el TIPO del argumento y resuelve. Es la misma idea que en
// ASP.NET Core: no hace falta anotación, basta con declarar qué se necesita.
Route::get('/ahora', function (Reloj $reloj) {
    return response()->json(['ahora' => $reloj->ahora(), 'origen' => 'inyectado']);
});
