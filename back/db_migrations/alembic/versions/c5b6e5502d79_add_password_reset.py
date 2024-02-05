"""add password reset

Revision ID: c5b6e5502d79
Revises: 584e48977f1c
Create Date: 2023-09-19 15:22:09.456311

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c5b6e5502d79'
down_revision = '584e48977f1c'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('password_reset',
    sa.Column('hashed_reset_token', sa.String(), nullable=False),
    sa.Column('user_id', sa.UUID(), nullable=False),
    sa.Column('time_created', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('hashed_reset_token')
    )
    op.create_index(op.f('ix_password_reset_hashed_reset_token'), 'password_reset', ['hashed_reset_token'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_password_reset_hashed_reset_token'), table_name='password_reset')
    op.drop_table('password_reset')
    # ### end Alembic commands ###
