<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(api: __DIR__ . '/../routes/api.php', apiPrefix: '')
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Laravel responde 422 con su propio formato; aquí se adapta al del
        // contrato para que las diez respuestas sean comparables.
        $exceptions->render(function (ValidationException $e, Request $peticion) {
            $primero = collect($e->errors())->flatten()->first();

            return response()->json(['error' => $primero], 422);
        });
    })
    ->create();
