"""empty message

Revision ID: 2d61c784511a
Revises: 770c4707c640
Create Date: 2024-03-07 17:26:31.380328

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2d61c784511a'
down_revision = '770c4707c640'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cats', schema=None) as batch_op:
        batch_op.add_column(sa.Column('foster_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(None, 'users', ['foster_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cats', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('foster_id')

    # ### end Alembic commands ###
