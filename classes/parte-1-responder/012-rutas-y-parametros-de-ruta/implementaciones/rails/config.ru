# Rails en un solo archivo: sin generador, para que se vea el núcleo.
require "action_controller/railtie"

class Aplicacion < Rails::Application
  config.root = __dir__
  config.eager_load = false
  config.consider_all_requests_local = false
  config.secret_key_base = "clase-012-no-es-un-secreto-real"
  config.hosts.clear

  routes.append do
    get "/tareas/:id" => "tareas#mostrar"
  end
end

class TareasController < ActionController::Base
  # Los segmentos con nombre llegan en `params`, mezclados con los de la cadena
  # de consulta y los del cuerpo. Rails los unifica a propósito.
  def mostrar
    render json: { id: params[:id] }
  end
end

Aplicacion.initialize!
run Aplicacion
