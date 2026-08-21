<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use RuntimeException;

/**
 * Eloquent es Active Record de manual: el modelo ES la tabla.
 *
 * `$tarea->save()`, `$tarea->delete()`, `Tarea::find($id)`. No hay repositorio,
 * no hay mapeador: el objeto conoce su almacenamiento y lo usa.
 */
class Tarea extends Model
{
    protected $table = 'tareas';

    protected $fillable = ['titulo', 'hecha'];

    protected $casts = ['hecha' => 'boolean'];

    public $timestamps = false;

    /**
     * La regla vive EN EL MODELO, colgada del evento `saving`.
     *
     * Es lo que distingue a Active Record de un DTO con métodos: si el objeto
     * sabe guardarse, tiene sentido que sepa también cuándo NO debe hacerlo — y
     * la regla se aplica venga la llamada de donde venga.
     */
    protected static function booted(): void
    {
        static::saving(function (Tarea $tarea) {
            if (trim((string) $tarea->titulo) === '') {
                throw new RuntimeException('TITULO_REQUERIDO');
            }
        });
    }

    public function salida(): array
    {
        return [
            'id' => (int) $this->id,
            'titulo' => $this->titulo,
            'hecha' => (bool) $this->hecha,
        ];
    }
}
