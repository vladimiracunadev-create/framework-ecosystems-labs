"""El guion que Alembic ejecuta para cada `upgrade` o `downgrade`.

Es el unico archivo de infraestructura de Alembic, y lo unico que hace es abrir
la conexion y ceder el control a las revisiones de `versions/`.
"""

from alembic import context
from sqlalchemy import engine_from_config, pool

configuracion = context.config


def en_linea() -> None:
    motor = engine_from_config(
        configuracion.get_section(configuracion.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with motor.connect() as conexion:
        context.configure(connection=conexion)
        with context.begin_transaction():
            context.run_migrations()


en_linea()
