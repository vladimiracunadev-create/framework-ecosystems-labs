# Rails en un solo archivo: sin generador, para que se vea el núcleo.
require "action_controller/railtie"

class Aplicacion < Rails::Application
  config.root = __dir__
  config.eager_load = false
  config.consider_all_requests_local = false
  config.secret_key_base = "clase-079-no-es-un-secreto-real"
  config.hosts.clear
  # Las vistas viven donde Rails espera: app/views/<controlador>/<accion>.
  config.paths["app/views"] = File.join(__dir__, "app", "views")

  routes.append do
    get "/tareas" => "tareas#index"
    get "/tareas-crudo" => "tareas#crudo"
  end
end

class TareasController < ActionController::Base
  # La tercera tarea es lo que un usuario escribió en un campo de texto.
  TAREAS = [
    { id: "1", titulo: "comprar pan" },
    { id: "2", titulo: "regar las plantas" },
    { id: "3", titulo: "<script>alerta(1)</script>" },
  ].freeze

  def index
    @tareas = TAREAS
    render "tareas/index", layout: false
  end

  def crudo
    @tareas = TAREAS
    render "tareas/crudo", layout: false
  end
end

Aplicacion.initialize!
run Aplicacion
