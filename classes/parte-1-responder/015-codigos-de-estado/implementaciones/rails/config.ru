# Rails en un solo archivo: sin generador, para que se vea el núcleo.
require "action_controller/railtie"

class Aplicacion < Rails::Application
  config.root = __dir__
  config.eager_load = false
  config.consider_all_requests_local = false
  config.secret_key_base = "clase-015-no-es-un-secreto-real"
  config.hosts.clear

  routes.append do
    post "/tareas" => "tareas#create"
    delete "/tareas/:id" => "tareas#destroy"
    get "/tareas/:id" => "tareas#show"
  end
end

class TareasController < ActionController::Base
  skip_forgery_protection

  TAREAS = { "1" => { id: "1", titulo: "original" } }
  ESTADO = { siguiente: 100 }

  def create
    id = ESTADO[:siguiente].to_s
    ESTADO[:siguiente] += 1
    TAREAS[id] = { id: id, titulo: params[:titulo].to_s }
    response.headers["Location"] = "/tareas/#{id}"
    # Rails acepta el nombre del código además del número: `:created` es 201.
    render json: { id: id }, status: :created
  end

  def destroy
    return render(json: { error: "no existe" }, status: :not_found) if TAREAS[params[:id]].nil?

    TAREAS.delete(params[:id])
    head :no_content
  end

  def show
    tarea = TAREAS[params[:id]]
    return render(json: { error: "no existe" }, status: :not_found) if tarea.nil?

    render json: tarea
  end
end

Aplicacion.initialize!
run Aplicacion
