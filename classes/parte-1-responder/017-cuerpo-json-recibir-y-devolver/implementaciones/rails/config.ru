# Rails en un solo archivo: sin generador, para que se vea el núcleo.
require "action_controller/railtie"
require "json"

class Aplicacion < Rails::Application
  config.root = __dir__
  config.eager_load = false
  config.consider_all_requests_local = false
  config.secret_key_base = "clase-017-no-es-un-secreto-real"
  config.hosts.clear

  routes.append do
    post "/tareas" => "tareas#create"
  end
end

class TareasController < ActionController::Base
  skip_forgery_protection

  def create
    # Se lee el cuerpo crudo: el analizador de Rails ya habría fallado antes de
    # llegar aquí ante un JSON ilegible, y con su propio formato de error.
    cuerpo = JSON.parse(request.raw_post.presence || "null")
    titulo = cuerpo.is_a?(Hash) ? cuerpo["titulo"] : nil

    return render(json: { error: "titulo es obligatorio" }, status: 422) unless titulo.is_a?(String) && !titulo.empty?

    render json: { id: "1", titulo: titulo, completada: false }, status: :created
  rescue JSON::ParserError
    render json: { error: "cuerpo JSON mal formado" }, status: :bad_request
  end
end

Aplicacion.initialize!
run Aplicacion
