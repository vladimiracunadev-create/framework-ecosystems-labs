<?php

use App\Models\Tarea;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;

// El servidor de PHP arranca un proceso POR PETICIÓN: no hay un «al iniciar»
// donde crear la tabla una sola vez. Por eso se comprueba si existe. El archivo
// de la base lo deja vacío el paso de preparación.
if (! Schema::hasTable('tareas')) {
    Schema::create('tareas', function (Blueprint $tabla) {
        $tabla->id();
        $tabla->string('titulo', 120);
        $tabla->boolean('hecha')->default(false);
    });
}

Route::post('/tareas', function (Request $peticion) {
    $tarea = new Tarea(['titulo' => (string) $peticion->input('titulo', ''), 'hecha' => false]);
    try {
        $tarea->save();
    } catch (RuntimeException $error) {
        return response()->json(['code' => $error->getMessage()], 422);
    }

    return response()->json($tarea->salida(), 201);
});

Route::get('/tareas', function () {
    $tareas = Tarea::orderBy('id')->get();

    return response()->json([
        'tareas' => $tareas->map(fn (Tarea $t) => $t->salida())->all(),
        'total' => $tareas->count(),
    ]);
});

Route::get('/tareas/{id}', function (int $id) {
    $tarea = Tarea::find($id);

    return $tarea === null
        ? response()->json(['code' => 'NO_EXISTE'], 404)
        : response()->json($tarea->salida());
});

Route::patch('/tareas/{id}', function (Request $peticion, int $id) {
    $tarea = Tarea::find($id);
    if ($tarea === null) {
        return response()->json(['code' => 'NO_EXISTE'], 404);
    }
    if ($peticion->has('titulo')) {
        $tarea->titulo = (string) $peticion->input('titulo');
    }
    if ($peticion->has('hecha')) {
        $tarea->hecha = (bool) $peticion->input('hecha');
    }
    try {
        $tarea->save();
    } catch (RuntimeException $error) {
        return response()->json(['code' => $error->getMessage()], 422);
    }

    return response()->json($tarea->salida());
});

Route::delete('/tareas/{id}', function (int $id) {
    $tarea = Tarea::find($id);
    if ($tarea === null) {
        return response()->json(['code' => 'NO_EXISTE'], 404);
    }
    $tarea->delete();

    return response()->noContent();
});
