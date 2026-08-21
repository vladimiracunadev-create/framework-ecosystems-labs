<?php

/**
 * Punto de entrada. Es el único archivo que el servidor web expone: todo lo
 * demás queda fuera de la raíz pública. El patrón se llama controlador frontal
 * y lo comparten Laravel, Symfony y casi todo el PHP moderno.
 */

require __DIR__ . '/../vendor/autoload.php';

/** @var Illuminate\Foundation\Application $app */
$app = require_once __DIR__ . '/../bootstrap/app.php';

$app->handleRequest(Illuminate\Http\Request::capture());
