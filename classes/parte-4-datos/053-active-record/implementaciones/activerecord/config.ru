# Rails en un solo archivo, con Active Record usado como Active Record: el
# modelo ES la tabla. `tarea.save`, `tarea.destroy`, `Tarea.find`. Rails le da
# nombre al patrón porque su ORM lo lleva al extremo.
require "action_controller/railtie"
require "active_record/railtie"

ActiveRecord::Base.establish_connection(adapter: "sqlite3", database: "datos.db")

conexion = ActiveRecord::Base.connection
conexion.execute("DROP TABLE IF EXISTS tareas")
conexion.execute(<<~SQL)
  CREATE TABLE tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    hecha BOOLEAN NOT NULL DEFAULT 0
  )
SQL

class Tarea < ActiveRecord::Base
  self.table_name = "tareas"

  # La regla vive EN EL MODELO. Y en Rails no hay que acordarse de ejecutarla:
  # `save` valida siempre y devuelve false si algo falla. Es una diferencia real
  # con Django, donde `save` escribe lo que le des y validar es un paso aparte.
  validates :titulo, presence: true

  def salida
    { id: id, titulo: titulo, hecha: hecha }
  end
end

class Aplicacion < Rails::Application
  config.root = __dir__
  config.eager_load = false
  config.consider_all_requests_local = false
  config.secret_key_base = "clase-053-no-es-un-secreto-real"
  config.hosts.clear

  routes.append do
    post "/tareas" => "tareas#crear"
    get "/tareas" => "tareas#listar"
    get "/tareas/:id" => "tareas#obtener"
    patch "/tareas/:id" => "tareas#modificar"
    delete "/tareas/:id" => "tareas#borrar"
  end
end

class TareasController < ActionController::Base
  protect_from_forgery with: :null_session

  def crear
    tarea = Tarea.new(titulo: params[:titulo].to_s, hecha: false)
    if tarea.save
      render json: tarea.salida, status: 201
    else
      render json: { code: "TITULO_REQUERIDO" }, status: 422
    end
  end

  def listar
    tareas = Tarea.order(:id)
    render json: { tareas: tareas.map(&:salida), total: tareas.size }
  end

  def obtener
    tarea = Tarea.find_by(id: params[:id])
    if tarea.nil?
      render json: { code: "NO_EXISTE" }, status: 404
    else
      render json: tarea.salida
    end
  end

  def modificar
    tarea = Tarea.find_by(id: params[:id])
    return render json: { code: "NO_EXISTE" }, status: 404 if tarea.nil?

    tarea.titulo = params[:titulo].to_s if params.key?(:titulo)
    tarea.hecha = params[:hecha] if params.key?(:hecha)
    if tarea.save
      render json: tarea.salida
    else
      render json: { code: "TITULO_REQUERIDO" }, status: 422
    end
  end

  def borrar
    tarea = Tarea.find_by(id: params[:id])
    return render json: { code: "NO_EXISTE" }, status: 404 if tarea.nil?

    tarea.destroy
    head 204
  end
end

Aplicacion.initialize!
run Aplicacion
