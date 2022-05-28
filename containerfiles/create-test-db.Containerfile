FROM docker.io/library/python:3.10-slim as back-buildtest
WORKDIR /code

# Install poetry
RUN pip install poetry~=1.1
COPY back/pyproject.toml back/poetry.lock /code/

# Install deps
RUN poetry config virtualenvs.in-project true \
  && poetry install --no-interaction --no-ansi

# Install backend app for database connection
COPY back/tmeit_backend /code/tmeit_backend
RUN poetry install --no-interaction --no-ansi

COPY back/db_migrations/ /code

CMD ["/code/.venv/bin/python", "scripts/create_test_database.py"]
