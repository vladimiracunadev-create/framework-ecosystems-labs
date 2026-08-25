<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// `api:` y no `web:`, y con el prefijo vacío. La diferencia es la que enseña la
// clase 072: el grupo `web` trae sesión, cookies cifradas y verificación del
// testigo CSRF, y este contrato envía JSON sin testigo — el grupo `web`
// respondería 419 a todos los POST. Una API con token no necesita esa capa.
//
// `apiPrefix: ''` quita el `/api` que Laravel antepone por omisión, porque el
// contrato es el mismo para los cinco y no puede tener rutas distintas en uno.
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(api: __DIR__ . '/../routes/api.php', apiPrefix: '')
    ->withMiddleware(function (Middleware $middleware) {
        // Sin capas propias en esta clase.
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Comportamiento por omisión.
    })
    ->create();
