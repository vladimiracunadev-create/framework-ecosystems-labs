<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

interface Reloj
{
    public function ahora(): string;
}

class RelojFijo implements Reloj
{
    public function ahora(): string
    {
        return '2026-01-01T00:00:00Z';
    }
}

$app = Application::configure(basePath: dirname(__DIR__))
    ->withRouting(api: __DIR__ . '/../routes/api.php', apiPrefix: '')
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();

// Se ata el contrato a su implementación. A partir de aquí, cualquier sitio que
// pida `Reloj` recibe un `RelojFijo` sin nombrarlo.
$app->bind(Reloj::class, RelojFijo::class);

return $app;
