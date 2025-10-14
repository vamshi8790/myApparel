"""update cart_id FK in orders to ON DELETE SET NULL

Revision ID: a75fe4ddb14f
Revises: e58d7d10ec03
Create Date: 2025-10-13 19:21:48.132814

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a75fe4ddb14f'
down_revision: Union[str, Sequence[str], None] = 'e58d7d10ec03'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
