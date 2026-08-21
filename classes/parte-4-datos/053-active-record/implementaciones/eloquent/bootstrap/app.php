<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(web: __DIR__ . '/../routes/web.php')
    ->withMiddleware(function (Middleware $middleware) {
        // Este servicio habla JSON, no formularios: la comprobación de token
        // CSRF del grupo `web` no aplica y rechazaría cada POST con un 419.
        $middleware->validateCsrfTokens(except: ['*']);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Comportamiento por omisión.
    })
    ->create();
