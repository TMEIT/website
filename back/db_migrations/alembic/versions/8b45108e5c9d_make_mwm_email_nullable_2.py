"""Make mwm email nullable 2

Revision ID: 8b45108e5c9d
Revises: 610eda95e782
Create Date: 2022-10-31 20:15:52.874506

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8b45108e5c9d'
down_revision = '610eda95e782'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('member_website_migration', 'login_email',
               existing_type=sa.VARCHAR(),
               nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('member_website_migration', 'login_email',
               existing_type=sa.VARCHAR(),
               nullable=False)
    # ### end Alembic commands ###