"""Add adopted to cats

Revision ID: 770c4707c640
Revises: 0fa9cf163a67
Create Date: 2024-03-04 14:52:24.279441

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '770c4707c640'
down_revision = '0fa9cf163a67'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cats', schema=None) as batch_op:
        # Add 'adopted' column with default value False
        batch_op.add_column(sa.Column('adopted', sa.Boolean(), nullable=False, server_default=sa.text('false')))

    # Apply the server default to the existing rows
    op.execute('UPDATE cats SET adopted = false WHERE adopted IS NULL')

    # Make the change permanent and not just for new rows
    with op.batch_alter_table('cats', schema=None) as batch_op:
        batch_op.alter_column('adopted', existing_type=sa.Boolean(), nullable=False, server_default=None)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cats', schema=None) as batch_op:
        batch_op.drop_column('adopted')

    # ### end Alembic commands ###
