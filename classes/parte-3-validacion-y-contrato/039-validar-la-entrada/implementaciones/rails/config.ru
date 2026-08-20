# Rails en un solo archivo: sin generador, para que se vea el núcleo.
require "action_controller/railtie"
require "active_model"

class Aplicacion < Rails::Application
  config.root = __dir__
  config.eager_load = false
  config.consider_all_requests_local = false
  config.secret_key_base = "clase-039-no-es-un-secreto-real"
  config.hosts.clear

  routes.append do
    post "/tareas" => "tareas#create"
  end
end

# ActiveModel da validaciones sin base de datos: el mismo mecanismo que usan los
# modelos de ActiveRecord, sobre un objeto normal.
class Tarea
  include ActiveModel::Model

  attr_accessor :titulo, :completada

  validates :titulo, presence: true, length: { maximum: 120 }
end

class TareasController < ActionController::Base
  skip_forgery_protection

  def create
    tarea = Tarea.new(titulo: params[:titulo].is_a?(String) ? params[:titulo].strip : nil,
                      completada: params[:completada])

    unless params[:completada].nil? || [true, false].include?(params[:completada])
      return render json: { error: "completada debe ser booleano" }, status: 422
    end

    unless tarea.valid?
      return render json: { error: tarea.errors.full_messages.first }, status: 422
    end

    render json: { titulo: tarea.titulo, completada: tarea.completada || false },
           status: :created
  end
end

Aplicacion.initialize!
run Aplicacion
