# This Containerfile (aka a Dockerfile) builds the image for the website worker that runs tasks (like emailing) in the background

# Python builder.
FROM docker.io/library/python:3.10 as build
WORKDIR /code
RUN apt update -q && apt install gcc -yq
RUN pip install poetry~=1.2
# Install dependencies and dev dependencies (keep venv inside /code/ because it's simpler)
COPY back/pyproject.toml back/poetry.lock /code/
RUN poetry config virtualenvs.in-project true \
  && poetry install --only arq-worker --no-interaction --no-ansi

# Worker container.
FROM docker.io/library/python:3.10-slim as app
WORKDIR /code
COPY back/pyproject.toml back/poetry.lock /code/
COPY --from=build /code/.venv /code/.venv
COPY /back/tmeit_backend /code/tmeit_backend
CMD ["/code/.venv/bin/arq", "tmeit_backend.arq.WorkerSettings"]
