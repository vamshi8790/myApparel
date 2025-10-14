"""set cartid to null

Revision ID: 7be69f32b976
Revises: 5da1c7e2410d
Create Date: 2025-10-13 20:00:46.248521

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7be69f32b976'
down_revision: Union[str, Sequence[str], None] = '5da1c7e2410d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
