<?php

use Illuminate\Support\Facades\Route;

// La tercera tarea es lo que un usuario escribió en un campo de texto.
$tareas = [
    ['id' => '1', 'titulo' => 'comprar pan'],
    ['id' => '2', 'titulo' => 'regar las plantas'],
    ['id' => '3', 'titulo' => '<script>alerta(1)</script>'],
];

Route::get('/tareas', fn () => view('tareas', ['tareas' => $tareas]));

// La misma lista por la puerta cruda de Blade.
Route::get('/tareas-crudo', fn () => view('tareas-crudo', ['tareas' => $tareas]));
