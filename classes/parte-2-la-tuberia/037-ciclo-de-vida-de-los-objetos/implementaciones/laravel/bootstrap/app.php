<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

class ServicioUnico
{
    public static int $creados = 0;
    public int $id;

    public function __construct()
    {
        $this->id = ++self::$creados;
    }
}

class ServicioPorPeticion
{
    public static int $creados = 0;
    public int $id;

    public function __construct()
    {
        $this->id = ++self::$creados;
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

// `singleton` guarda la instancia; `bind` construye una nueva cada vez.
//
// Aviso importante sobre PHP: el servidor de desarrollo atiende cada petición
// en un PROCESO NUEVO, así que aquí «única instancia» dura lo que dura la
// petición. Con un gestor de procesos persistente el matiz cambia, y esa
// diferencia de modelo de ejecución es parte de lo que enseña esta clase.
$app->singleton(ServicioUnico::class);
$app->bind(ServicioPorPeticion::class);

return $app;
