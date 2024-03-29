"""Initial migration.

Revision ID: 0fa9cf163a67
Revises: 
Create Date: 2024-03-04 12:12:28.923218

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0fa9cf163a67'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cats', schema=None) as batch_op:
        batch_op.alter_column('microchip',
               existing_type=sa.INTEGER(),
               type_=sa.BigInteger(),
               existing_nullable=True)
        batch_op.drop_constraint('cats_foster_id_fkey', type_='foreignkey')
        batch_op.drop_column('foster_id')

    with op.batch_alter_table('fosters', schema=None) as batch_op:
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.drop_constraint('fosters_cat_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(None, 'cats', ['cat_id'], ['id'], ondelete='CASCADE')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('fosters', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('fosters_cat_id_fkey', 'cats', ['cat_id'], ['id'])
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    with op.batch_alter_table('cats', schema=None) as batch_op:
        batch_op.add_column(sa.Column('foster_id', sa.INTEGER(), autoincrement=False, nullable=False))
        batch_op.create_foreign_key('cats_foster_id_fkey', 'fosters', ['foster_id'], ['id'])
        batch_op.alter_column('microchip',
               existing_type=sa.BigInteger(),
               type_=sa.INTEGER(),
               existing_nullable=True)

    # ### end Alembic commands ###
