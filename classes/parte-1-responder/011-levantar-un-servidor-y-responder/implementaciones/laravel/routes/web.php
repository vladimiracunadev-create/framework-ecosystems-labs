<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response('hola', 200)->header('Content-Type', 'text/plain');
});
