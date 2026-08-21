# Rails en un solo archivo, con Active Record pero SIN usarlo como Active Record:
# aquí se escribe el SQL a mano y el modelo solo sirve para recibir las filas.
require "action_controller/railtie"
require "active_record/railtie"

ActiveRecord::Base.establish_connection(adapter: "sqlite3", database: "datos.db")

conexion = ActiveRecord::Base.connection
conexion.execute("DROP TABLE IF EXISTS tareas")
conexion.execute(<<~SQL)
  CREATE TABLE tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL
  )
SQL

class Tarea < ActiveRecord::Base
  self.table_name = "tareas"
end

class Aplicacion < Rails::Application
  config.root = __dir__
  config.eager_load = false
  config.consider_all_requests_local = false
  config.secret_key_base = "clase-052-no-es-un-secreto-real"
  config.hosts.clear

  routes.append do
    post "/tareas" => "tareas#crear"
    get "/tareas" => "tareas#listar"
    get "/tareas/:id" => "tareas#obtener"
  end
end

class TareasController < ActionController::Base
  protect_from_forgery with: :null_session

  # `sanitize_sql_array` con `?` es la forma documentada de escribir SQL a mano
  # en Rails. El valor no se pega en la cadena: se escapa con las reglas del
  # adaptador antes de llegar a la base, y por eso `'; DROP TABLE tareas; --`
  # acaba siendo un título de tarea.
  def crear
    titulo = params[:titulo].to_s
    id = ActiveRecord::Base.connection.insert(
      ActiveRecord::Base.sanitize_sql_array(
        ["INSERT INTO tareas (titulo) VALUES (?)", titulo]
      )
    )
    render json: { id: id, titulo: titulo }, status: 201
  end

  # `find_by_sql` con un array es la otra mitad de lo mismo: SQL escrito por ti,
  # marcadores rellenados por Rails.
  def listar
    tareas =
      if params[:titulo].nil?
        Tarea.find_by_sql("SELECT id, titulo FROM tareas ORDER BY id")
      else
        Tarea.find_by_sql(
          ["SELECT id, titulo FROM tareas WHERE titulo = ? ORDER BY id", params[:titulo]]
        )
      end
    render json: {
      tareas: tareas.map { |t| { id: t.id, titulo: t.titulo } },
      total: tareas.size
    }
  end

  def obtener
    tarea = Tarea.find_by_sql(
      ["SELECT id, titulo FROM tareas WHERE id = ?", params[:id].to_i]
    ).first
    if tarea.nil?
      render json: { code: "NO_EXISTE" }, status: 404
    else
      render json: { id: tarea.id, titulo: tarea.titulo }
    end
  end
end

Aplicacion.initialize!
run Aplicacion
