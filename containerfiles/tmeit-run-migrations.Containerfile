FROM docker.io/library/python:3.10-alpine

WORKDIR /code

ENV TMEIT_PROD_MIGRATION=true

RUN pip install alembic==1.8.1 sqlalchemy["postgresql_asyncpg"]==2.0.0b2

# Pull database connection code from app and use it as a bare file
COPY back/tmeit_backend/database.py /code

COPY back/db_migrations/ /code

CMD ["alembic", "upgrade", "head"]
