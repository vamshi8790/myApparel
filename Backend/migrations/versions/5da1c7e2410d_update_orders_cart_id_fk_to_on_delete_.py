"""update orders.cart_id FK to ON DELETE SET NULL

Revision ID: 5da1c7e2410d
Revises: a75fe4ddb14f
Create Date: 2025-10-13 19:46:08.825192

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5da1c7e2410d'
down_revision: Union[str, Sequence[str], None] = 'a75fe4ddb14f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop existing FK if exists
    op.drop_constraint('orders_cart_id_fkey', 'orders', type_='foreignkey')
    
    # Alter cart_id column to be nullable
    op.alter_column('orders', 'cart_id', existing_type=sa.UUID(), nullable=True)
    
    # Recreate FK with ON DELETE SET NULL
    op.create_foreign_key(
        'orders_cart_id_fkey',
        'orders', 'cart',
        ['cart_id'], ['id'],
        ondelete='SET NULL'
    )


def downgrade() -> None:
    # Drop modified FK
    op.drop_constraint('orders_cart_id_fkey', 'orders', type_='foreignkey')
    
    # Make cart_id NOT NULL
    op.alter_column('orders', 'cart_id', existing_type=sa.UUID(), nullable=False)
    
    # Recreate original FK
    op.create_foreign_key(
        'orders_cart_id_fkey',
        'orders', 'cart',
        ['cart_id'], ['id']
    )

