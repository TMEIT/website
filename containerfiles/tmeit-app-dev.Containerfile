# This Containerfile builds the app container for use with the Tilt developer environment.

# This containerfile compiles the frontend in dev mode for better debugging.

FROM docker.io/library/node:18-alpine as front-build
ENV NODE_OPTIONS=--openssl-legacy-provider
WORKDIR /code
COPY front/package.json front/package-lock.json /code/
RUN npm install --silent
COPY front/src/ /code/src/
COPY front/webpack.config.js /code/
RUN npm run-script build

FROM docker.io/library/python:3.10-slim as back-build
WORKDIR /code
RUN apt update -q && apt install gcc -yq
RUN pip install poetry~=1.2
COPY back/pyproject.toml back/poetry.lock /code/
RUN poetry config virtualenvs.in-project true \
  && poetry install --only main --no-interaction --no-ansi

FROM docker.io/library/python:3.10-slim as app
WORKDIR /code
COPY back/pyproject.toml back/poetry.lock /code/
COPY --from=back-build /code/.venv /code/.venv
COPY --from=front-build /code/www/ /code/static/front
COPY back/tmeit_backend /code/tmeit_backend
CMD ["/code/.venv/bin/uvicorn", "tmeit_backend.app_root:app", "--host", "0.0.0.0", "--port", "8080", "--forwarded-allow-ips='*'"]
