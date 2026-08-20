# Rails en un solo archivo: sin generador, para que se vea el núcleo.
require "action_controller/railtie"

class Aplicacion < Rails::Application
  config.root = __dir__
  config.eager_load = false
  config.consider_all_requests_local = false
  config.secret_key_base = "clase-013-no-es-un-secreto-real"
  config.hosts.clear

  routes.append do
    get "/tareas" => "tareas#index"
  end
end

class TareasController < ActionController::Base
  POR_OMISION = 20

  def index
    bruto = params[:limite]
    return render(json: { limite: POR_OMISION }) if bruto.nil?

    # Integer(..., exception: false) devuelve nil en vez de reventar o de
    # convertir "12abc" a 12 como haría to_i.
    limite = Integer(bruto, exception: false)
    if limite.nil? || limite < 1 || limite > 100
      return render json: { error: "limite debe ser un entero entre 1 y 100" }, status: 422
    end

    render json: { limite: limite }
  end
end

Aplicacion.initialize!
run Aplicacion
