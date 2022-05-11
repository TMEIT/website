# This Containerfile (aka a Dockerfile) builds the container image for the app.

FROM docker.io/library/python:3.10-slim

WORKDIR /code

RUN pip install poetry~=1.1

COPY back/pyproject.toml back/poetry.lock /code/

RUN poetry config virtualenvs.create false \
  && poetry install --no-dev --no-interaction --no-ansi

COPY back/tmeit_backend /code/tmeit_backend

COPY front/www/ /code/static/

CMD ["uvicorn", "tmeit_backend.wsgi:application", "--host", "0.0.0.0", "--port", "80"]
