<?php

return [
    'default' => 'sqlite',

    'connections' => [
        'sqlite' => [
            'driver' => 'sqlite',
            'database' => database_path('datos.sqlite'),
            'prefix' => '',
            // SQLite ignora las claves ajenas salvo que se le pida por conexión.
            // Aquí no hay relaciones todavía —eso es la clase 055—, pero dejarlo
            // apagado por omisión sería la trampa de siempre.
            'foreign_key_constraints' => true,
        ],
    ],

    'migrations' => 'migrations',
];
