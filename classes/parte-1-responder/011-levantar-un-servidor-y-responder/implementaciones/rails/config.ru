# Rails en un solo archivo: sin generador, para que se vea el núcleo.
require "action_controller/railtie"

class Aplicacion < Rails::Application
  config.root = __dir__
  config.eager_load = false
  config.consider_all_requests_local = false
  config.secret_key_base = "clase-011-no-es-un-secreto-real"
  config.hosts.clear

  routes.append do
    get "/" => "raiz#mostrar"
  end
end

class RaizController < ActionController::Base
  def mostrar
    render plain: "hola"
  end
end

Aplicacion.initialize!
run Aplicacion
