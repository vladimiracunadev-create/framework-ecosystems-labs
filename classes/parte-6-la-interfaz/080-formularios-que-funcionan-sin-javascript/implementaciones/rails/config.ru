# Rails en un solo archivo: sin generador, para que se vea el núcleo.
require "action_controller/railtie"

class Aplicacion < Rails::Application
  config.root = __dir__
  config.eager_load = false
  config.consider_all_requests_local = false
  config.secret_key_base = "clase-080-no-es-un-secreto-real-pero-tiene-que-ser-largo"
  config.hosts.clear
  config.paths["app/views"] = File.join(__dir__, "app", "views")

  # La sesión de cookies: el testigo CSRF vive ahí y el navegador vuelve con
  # él en el envío. Sin sesión no hay testigo que comparar.
  config.middleware.use ActionDispatch::Cookies
  config.middleware.use ActionDispatch::Session::CookieStore, key: "_clase080"

  routes.append do
    get "/tareas" => "tareas#index"
    post "/tareas" => "tareas#create"
  end
end

class TareasController < ActionController::Base
  # La verificación del testigo ACTIVA, y respondiendo con un código de error
  # en vez de reiniciar la sesión en silencio: el contrato mide el rechazo.
  protect_from_forgery with: :exception

  rescue_from ActionController::InvalidAuthenticityToken do
    head :forbidden
  end

  TAREAS = []

  def index
    @tareas = TAREAS
    render "tareas/index", layout: false
  end

  def create
    TAREAS << { id: (TAREAS.size + 1).to_s, titulo: params[:titulo].to_s }
    # ENVIAR, REDIRIGIR, MOSTRAR. La respuesta al POST no es la página: es un
    # 303 a la página. Sin esto, recargar reenvía el formulario.
    redirect_to "/tareas", status: :see_other
  end
end

Aplicacion.initialize!
run Aplicacion
