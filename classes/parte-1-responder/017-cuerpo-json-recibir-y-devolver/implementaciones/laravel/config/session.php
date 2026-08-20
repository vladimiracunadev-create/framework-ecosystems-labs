<?php

/**
 * El grupo de rutas `web` incluye la capa de sesión. Por omisión Laravel la
 * guarda en base de datos, y en esta clase no hay base de datos: la ponemos en
 * memoria. Es la primera lección de la clase 011 en un framework completo — para
 * decir «hola» hay que declarar cosas que Express nunca pregunta.
 */

return [
    'driver' => 'array',
    'lifetime' => 120,
    'expire_on_close' => false,
    'encrypt' => false,
    'cookie' => 'clase011_session',
    'path' => '/',
    'domain' => null,
    'secure' => false,
    'http_only' => true,
    'same_site' => 'lax',
];
