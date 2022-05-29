FROM docker.io/library/python:3.10-alpine

WORKDIR /code

ENV TMEIT_PROD_MIGRATION=true

RUN pip install alembic==1.7.7 sqlalchemy["postgresql_asyncpg"]==1.4.36

# Pull database connection code from app and use it as a bare file
COPY back/tmeit_backend/database.py /code

COPY back/db_migrations/ /code

CMD ["alembic", "upgrade", "head"]
