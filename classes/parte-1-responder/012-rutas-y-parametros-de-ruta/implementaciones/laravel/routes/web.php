<?php

use Illuminate\Support\Facades\Route;

// `{id}` se inyecta como argumento del manejador, en orden de aparición.
Route::get('/tareas/{id}', function (string $id) {
    return response()->json(['id' => $id]);
});
