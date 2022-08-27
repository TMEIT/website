FROM docker.io/library/python:3.10-alpine

WORKDIR /code

ENV TMEIT_PROD_MIGRATION=true

# Greenlet is a dependency for sqlalchemy.
# Greenlet 1.1.3 adds support for python 3.11 but will not install on alpine, so we use 1.1.2.
RUN pip install alembic==1.7.7 sqlalchemy["postgresql_asyncpg"]==1.4.36 greenlet==1.1.2

# Pull database connection code from app and use it as a bare file
COPY back/tmeit_backend/database.py /code

COPY back/db_migrations/ /code

CMD ["alembic", "upgrade", "head"]
