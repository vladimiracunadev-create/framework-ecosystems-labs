"""Crear la tabla de tareas, sin prioridad.

Revision ID: 001_crear_tareas
Revises:
"""

import sqlalchemy as sa
from alembic import op

revision = "001_crear_tareas"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    tareas = op.create_table(
        "tareas",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("titulo", sa.String(120), nullable=False),
    )
    # Una fila creada AQUI, antes de que exista la columna. Sin ella no habria
    # nada que rellenar en la revision siguiente, y la clase no probaria nada.
    op.bulk_insert(tareas, [{"titulo": "creada antes de la columna"}])


def downgrade() -> None:
    op.drop_table("tareas")
