# This Containerfile (aka a Dockerfile) builds the container image for the app.

FROM docker.io/library/node:18-alpine as front-builder
# Temporary workwaround for Node 18 until we update the app
ENV NODE_OPTIONS=--openssl-legacy-provider
WORKDIR /code
COPY front/package.json front/package-lock.json /code/
RUN npm install --silent
COPY front/ /code/
RUN npm run-script build:prod

FROM docker.io/library/python:3.10-slim as app
WORKDIR /code
RUN pip install poetry~=1.1
COPY back/pyproject.toml back/poetry.lock /code/
RUN poetry config virtualenvs.create false \
  && poetry install --no-dev --no-interaction --no-ansi
COPY back/tmeit_backend /code/tmeit_backend
COPY --from=front-builder /code/www/ /code/static/front
CMD ["uvicorn", "tmeit_backend.api_app:app", "--host", "0.0.0.0", "--port", "80"]
