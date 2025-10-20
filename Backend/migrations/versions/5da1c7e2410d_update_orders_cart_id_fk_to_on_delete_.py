"""update orders.cart_id FK to ON DELETE SET NULL

Revision ID: 5da1c7e2410d
Revises: a75fe4ddb14f
Create Date: 2025-10-13 19:46:08.825192

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '5da1c7e2410d'
down_revision: Union[str, Sequence[str], None] = 'a75fe4ddb14f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint('orders_cart_id_fkey', 'orders', type_='foreignkey')
    
    op.alter_column('orders', 'cart_id', existing_type=sa.UUID(), nullable=True)
    
    op.create_foreign_key(
        'orders_cart_id_fkey',
        'orders', 'cart',
        ['cart_id'], ['id'],
        ondelete='SET NULL'
    )


def downgrade() -> None:
    op.drop_constraint('orders_cart_id_fkey', 'orders', type_='foreignkey')
    
    op.alter_column('orders', 'cart_id', existing_type=sa.UUID(), nullable=False)
    
    op.create_foreign_key(
        'orders_cart_id_fkey',
        'orders', 'cart',
        ['cart_id'], ['id']
    )

