"""add date and time columns to events

Revision ID: 8a1190b1d69e
Revises: f1f829d8b88c
Create Date: 2023-07-27 01:08:25.198408

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8a1190b1d69e'
down_revision = 'f1f829d8b88c'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('events', sa.Column('event_date', sa.Date(), nullable=False))
    op.drop_column('events', 'event_time')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('events', sa.Column('event_time', sa.DATE(), autoincrement=False, nullable=False))
    op.drop_column('events', 'event_date')
    # ### end Alembic commands ###
