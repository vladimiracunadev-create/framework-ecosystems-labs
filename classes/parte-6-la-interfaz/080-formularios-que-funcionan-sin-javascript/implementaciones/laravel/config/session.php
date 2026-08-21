<?php

/**
 * Aquí la sesión SÍ tiene que persistir entre peticiones: el testigo CSRF
 * vive en ella, y el navegador vuelve con él en el envío del formulario. Por
 * eso el controlador es `file` y no `array` — con `array`, la sesión muere
 * con la petición y el testigo del formulario nunca casaría con nada.
 */

return [
    'driver' => 'file',
    'files' => __DIR__ . '/../storage/framework/sessions',
    'lifetime' => 120,
    'expire_on_close' => false,
    'encrypt' => false,
    'cookie' => 'clase080_session',
    'path' => '/',
    'domain' => null,
    'secure' => false,
    'http_only' => true,
    'same_site' => 'lax',
];
