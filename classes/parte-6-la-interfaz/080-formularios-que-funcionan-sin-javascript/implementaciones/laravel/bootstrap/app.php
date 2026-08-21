<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// `web:` y no `api:`. La diferencia es exactamente esta clase: el grupo `web`
// trae sesión, cookies cifradas y la verificación del testigo CSRF; el grupo
// `api` no trae nada de eso porque una API con token no lo necesita
// (clase 072).
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(web: __DIR__ . '/../routes/web.php')
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();
