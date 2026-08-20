<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

/**
 * Rutas `api` y no `web`, y la diferencia importa: el grupo `web` aplica sesión
 * y comprobación de falsificación de petición, que rechaza un PUT o un POST sin
 * testigo. Para una API que consumen clientes con token, ese grupo estorba. La
 * defensa contra falsificación se estudia en la clase 072.
 *
 * `apiPrefix: ''` quita el prefijo `/api` para que el contrato sea idéntico al
 * de los demás frameworks.
 */
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(api: __DIR__ . '/../routes/api.php', apiPrefix: '')
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();
