"""Anadir la columna de prioridad, con relleno para las filas que ya estaban.

Revision ID: 002_anadir_prioridad
Revises: 001_crear_tareas
"""

import sqlalchemy as sa
from alembic import op

revision = "002_anadir_prioridad"
down_revision = "001_crear_tareas"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # `server_default` no es cosmetico: sin el, la fila que ya existia se
    # quedaria con NULL en una columna declarada NOT NULL, y el motor rechazaria
    # la migracion entera.
    op.add_column(
        "tareas",
        sa.Column("prioridad", sa.Integer, nullable=False, server_default="0"),
    )


def downgrade() -> None:
    # Existe, y no devuelve los datos: quitar la columna los borra.
    op.drop_column("tareas", "prioridad")
