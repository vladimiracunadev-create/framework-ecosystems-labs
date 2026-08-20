<?php

use Illuminate\Support\Facades\Route;

Route::get('/a', fn () => response()->json(['ruta' => 'a']));
Route::get('/b', fn () => response()->json(['ruta' => 'b']));
