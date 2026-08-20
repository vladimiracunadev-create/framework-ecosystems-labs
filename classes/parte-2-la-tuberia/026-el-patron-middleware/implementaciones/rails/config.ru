# Rails en un solo archivo: sin generador, para que se vea el núcleo.
require "action_controller/railtie"

# Middleware de Rack: un objeto con `call(env)` que envuelve al siguiente. Es el
# patrón en su forma más desnuda, y Rails lo hereda entero.
class Capa
  def initialize(app)
    @app = app
  end

  def call(env)
    estado, cabeceras, cuerpo = @app.call(env)
    cabeceras["x-capa"] = "intermedia"
    [estado, cabeceras, cuerpo]
  end
end

class Aplicacion < Rails::Application
  config.root = __dir__
  config.eager_load = false
  config.consider_all_requests_local = false
  config.secret_key_base = "clase-026-no-es-un-secreto-real"
  config.hosts.clear
  config.middleware.use Capa

  routes.append do
    get "/a" => "paginas#a"
    get "/b" => "paginas#b"
    match "*ruta" => "paginas#no_encontrado", via: :all
  end
end

class PaginasController < ActionController::Base
  def a
    render json: { ruta: "a" }
  end

  def b
    render json: { ruta: "b" }
  end

  def no_encontrado
    render json: { error: "no existe" }, status: :not_found
  end
end

Aplicacion.initialize!
run Aplicacion
