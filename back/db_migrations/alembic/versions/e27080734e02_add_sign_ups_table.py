"""add sign_ups table

Revision ID: e27080734e02
Revises: 2a101006d648
Create Date: 2022-08-28 11:30:47.888727

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'e27080734e02'
down_revision = '2a101006d648'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('sign_ups',
    sa.Column('uuid', postgresql.UUID(), nullable=False),
    sa.Column('time_created', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('ip_address', sa.String(), nullable=False),
    sa.Column('login_email', sa.String(), nullable=False),
    sa.Column('hashed_password', sa.String(), nullable=False),
    sa.Column('first_name', sa.String(), nullable=False),
    sa.Column('last_name', sa.String(), nullable=False),
    sa.Column('phone', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('uuid'),
    sa.UniqueConstraint('login_email')
    )
    op.create_index(op.f('ix_sign_ups_uuid'), 'sign_ups', ['uuid'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_sign_ups_uuid'), table_name='sign_ups')
    op.drop_table('sign_ups')
    # ### end Alembic commands ###
