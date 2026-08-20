<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * La forma canónica de una capa en Laravel: una CLASE con `handle($peticion,
 * Closure $siguiente)`. `$siguiente($peticion)` es el `next()` de Express.
 *
 * Laravel no acepta funciones anónimas aquí, y la razón es práctica: el
 * contenedor resuelve la clase por su nombre, lo que permite inyectarle
 * dependencias y reutilizarla por nombre en grupos de rutas.
 *
 * Normalmente vive en `app/Http/Middleware/`; aquí está a la vista.
 */
class Capa
{
    public function handle(Request $peticion, Closure $siguiente)
    {
        $respuesta = $siguiente($peticion);
        $respuesta->headers->set('X-Capa', 'intermedia');

        return $respuesta;
    }
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(api: __DIR__ . '/../routes/api.php', apiPrefix: '')
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append(Capa::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (NotFoundHttpException $e, Request $peticion) {
            return response()->json(['error' => 'no existe'], 404);
        });
    })
    ->create();
