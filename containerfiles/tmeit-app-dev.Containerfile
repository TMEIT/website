# This Containerfile  builds the app container for use with the Tilt developer environment.

# This containerfile compiles the frontend in dev mode, and skips the tests that the prod containerfile runs,
# in order to speed up build times when using hot-reload


FROM docker.io/library/node:18-alpine as front-buildtest
ENV NODE_OPTIONS=--openssl-legacy-provider
WORKDIR /code
COPY front/package.json front/package-lock.json /code/
RUN npm install --silent
COPY front/ /code/
RUN npm run-script build

FROM docker.io/library/python:3.10-slim as back-buildtest
WORKDIR /code
RUN pip install poetry~=1.1
COPY back/pyproject.toml back/poetry.lock /code/
RUN poetry config virtualenvs.in-project true \
  && poetry install --no-dev --no-interaction --no-ansi

FROM docker.io/library/python:3.10-slim as app
WORKDIR /code
COPY --from=back-buildtest /code/.venv /code/.venv
COPY --from=front-buildtest /code/www/ /code/static/front
COPY back/tmeit_backend /code/tmeit_backend
CMD ["/code/.venv/bin/uvicorn", "tmeit_backend.app_root:app", "--host", "0.0.0.0", "--port", "8080"]
