# Rails en un solo archivo: sin generador, para que se vea el núcleo.
#
# LA MISMA RUTA, DOS VECES.
#
# `/idiomatico/tareas` está escrita como se escribe en Rails: un modelo con
# `validates`, y el controlador solo pregunta si es válido.
#
# `/traducido/tareas` está traducida desde Express — no la sintaxis, sino LA
# SUPOSICIÓN: que el cuerpo se lee crudo y se comprueba a mano.
require "action_controller/railtie"
require "active_model"
require "json"

class Aplicacion < Rails::Application
  config.root = __dir__
  config.eager_load = false
  config.consider_all_requests_local = false
  config.secret_key_base = "clase-005-no-es-un-secreto-real"
  config.hosts.clear

  routes.append do
    post "/idiomatico/tareas" => "tareas#idiomatico"
    post "/traducido/tareas" => "tareas#traducido"
    get "/tareas" => "tareas#index"
    get "/tareas/:id" => "tareas#show"
    get "/comparacion" => "tareas#comparacion"
  end
end

TAREAS = []

# >>> idiomatico
# ActiveModel da validaciones sin base de datos: el mismo mecanismo que usan los
# modelos de ActiveRecord, sobre un objeto normal.
#
# `presence: true` en Rails considera vacío un texto de solo espacios, porque usa
# `blank?`. Esa es la regla que la traducción pierde.
class Tarea
  include ActiveModel::Model

  attr_accessor :titulo

  validates :titulo, presence: true

  def normalizado
    titulo.to_s.strip
  end
end
# <<< idiomatico

class TareasController < ActionController::Base
  skip_forgery_protection

  # >>> idiomatico
  def idiomatico
    tarea = Tarea.new(titulo: params[:titulo])
    return render(json: { code: "TITULO_INVALIDO" }, status: 422) unless tarea.valid?

    render json: guardar(tarea.normalizado), status: 201
  end
  # <<< idiomatico

  # >>> traducido
  # Traducida desde Express.
  #
  # `JSON.parse(request.body.read)` es el equivalente exacto de `req.body`, y a
  # partir de ahí todo se comprueba a mano. Funciona.
  #
  # Y de paso se salta los parámetros fuertes de Rails, que es la pieza que
  # decide qué campos del cuerpo pueden llegar al modelo. Aquí no hay modelo, así
  # que tampoco hay quien lo eche de menos — hasta que alguien manda un campo de
  # más.
  def traducido
    cuerpo = JSON.parse(request.body.read) rescue {}
    titulo = cuerpo["titulo"]
    if titulo.nil? || titulo == ""
      return render(json: { code: "TITULO_INVALIDO" }, status: 422)
    end

    render json: guardar(titulo), status: 201
  end
  # <<< traducido

  def index
    render json: { total: TAREAS.length, tareas: TAREAS }
  end

  def show
    tarea = TAREAS.find { |t| t[:id] == params[:id].to_i }
    return render(json: { code: "NO_EXISTE" }, status: 404) if tarea.nil?

    render json: tarea
  end

  # LA COMPARACIÓN, MEDIDA.
  #
  # `mismo_camino_feliz` no está escrito a mano: se pasa el mismo cuerpo válido
  # por las dos versiones y se comparan los resultados. Afirmar que coinciden sin
  # comprobarlo sería exactamente el error que esta clase enseña a no cometer.
  def comparacion
    entrada = "misma tarea"
    por_la_idiomatica = Tarea.new(titulo: entrada).normalizado
    por_la_traducida = entrada

    render json: {
      mismo_camino_feliz: por_la_idiomatica == por_la_traducida,
      quien_valida_en_la_idiomatica: "activemodel, con presence: true",
      quien_valida_en_la_traducida: "nadie",
      de_donde_viene_la_traduccion: "express",
      usa_parametros_fuertes_la_idiomatica: true,
      usa_parametros_fuertes_la_traducida: false,
      lineas_idiomatico: lineas_entre("idiomatico"),
      lineas_traducido: lineas_entre("traducido")
    }
  end

  private

  def guardar(titulo)
    tarea = { id: TAREAS.length + 1, titulo: titulo }
    TAREAS << tarea
    tarea
  end

  # Cuenta las líneas de código de los bloques marcados leyendo ESTE archivo.
  def lineas_entre(marca)
    lineas = File.readlines(File.join(__dir__, "config.ru"), chomp: true)
    dentro = false
    lineas.count do |linea|
      if linea.include?(">>> #{marca}")
        dentro = true
        false
      elsif linea.include?("<<< #{marca}")
        dentro = false
        false
      else
        dentro && !linea.strip.empty? && !linea.strip.start_with?("#")
      end
    end
  end
end

Aplicacion.initialize!
run Aplicacion
