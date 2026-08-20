# Rails en un solo archivo: sin generador, para que se vea el núcleo.
require "action_controller/railtie"

class Aplicacion < Rails::Application
  config.root = __dir__
  config.eager_load = false
  config.consider_all_requests_local = false
  config.secret_key_base = "clase-016-no-es-un-secreto-real"
  config.hosts.clear

  routes.append do
    get "/eco" => "eco#mostrar"
  end
end

class EcoController < ActionController::Base
  def mostrar
    # Rack conserva la convención antigua: `HTTP_` delante y guiones bajos.
    recibido = request.headers["X-Peticion"] || "(ninguna)"
    response.headers["X-Respuesta"] = "servida"
    response.headers["Cache-Control"] = "no-store"
    render json: { recibido: recibido }
  end
end

Aplicacion.initialize!
run Aplicacion
