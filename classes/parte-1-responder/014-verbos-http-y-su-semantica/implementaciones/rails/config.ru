# Rails en un solo archivo: sin generador, para que se vea el núcleo.
require "action_controller/railtie"

class Aplicacion < Rails::Application
  config.root = __dir__
  config.eager_load = false
  config.consider_all_requests_local = false
  config.secret_key_base = "clase-014-no-es-un-secreto-real"
  config.hosts.clear

  routes.append do
    get "/tareas/:id" => "tareas#show"
    put "/tareas/:id" => "tareas#update"
    post "/tareas" => "tareas#create"
  end
end

class TareasController < ActionController::Base
  # Se desactiva la comprobación de falsificación porque esta clase habla de
  # verbos, no de sesiones. La defensa se estudia en la clase 072.
  skip_forgery_protection

  TAREAS = { "1" => { id: "1", titulo: "original" } }
  ESTADO = { altas: 0 }

  def show
    tarea = TAREAS[params[:id]]
    return head :not_found if tarea.nil?

    render json: tarea
  end

  def update
    tarea = { id: params[:id], titulo: params[:titulo].to_s }
    TAREAS[params[:id]] = tarea
    render json: tarea
  end

  def create
    ESTADO[:altas] += 1
    id = "nueva-#{ESTADO[:altas]}"
    TAREAS[id] = { id: id, titulo: params[:titulo].to_s }
    response.headers["Location"] = "/tareas/#{id}"
    render json: { id: id, altas: ESTADO[:altas] }, status: :created
  end
end

Aplicacion.initialize!
run Aplicacion
