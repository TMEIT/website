"""Add member website migration model

Revision ID: bd3a7cf57de1
Revises: e27080734e02
Create Date: 2022-10-28 02:13:00.537076

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'bd3a7cf57de1'
down_revision = 'e27080734e02'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('member_website_migration',
    sa.Column('uuid', postgresql.UUID(), nullable=False),
    sa.Column('security_token', sa.String(), nullable=False),
    sa.Column('email_sent', sa.Date(), nullable=True),
    sa.Column('time_created', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('time_updated', sa.DateTime(timezone=True), nullable=True),
    sa.Column('login_email', sa.String(), nullable=False),
    sa.Column('current_role', sa.String(), nullable=False),
    sa.Column('first_name', sa.String(), nullable=False),
    sa.Column('nickname', sa.String(), nullable=True),
    sa.Column('last_name', sa.String(), nullable=False),
    sa.Column('phone', sa.String(), nullable=True),
    sa.Column('drivers_license', sa.Boolean(), nullable=True),
    sa.Column('stad', sa.Date(), nullable=True),
    sa.Column('fest', sa.Date(), nullable=True),
    sa.Column('liquor_permit', sa.Date(), nullable=True),
    sa.PrimaryKeyConstraint('uuid'),
    sa.UniqueConstraint('login_email')
    )
    op.create_index(op.f('ix_member_website_migration_uuid'), 'member_website_migration', ['uuid'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_member_website_migration_uuid'), table_name='member_website_migration')
    op.drop_table('member_website_migration')
    # ### end Alembic commands ###
