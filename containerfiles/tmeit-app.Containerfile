# This Containerfile (aka a Dockerfile) builds the prod container image for the app.

# Frontend builder.
# Installs frontend build deps, and then compiles/minifies the frontend.
FROM docker.io/library/node:18-alpine as front-build
# Temporary workwaround for Node 18 until we update the app
ENV NODE_OPTIONS=--openssl-legacy-provider
WORKDIR /code
COPY front/package.json front/package-lock.json /code/
RUN npm install --silent
COPY front/src/ /code/src/
COPY front/webpack.config.js /code/
RUN npm run-script build:prod

# Backend builder.
# Installs and builds backend deps, precompiled deps in .venv can then be copied to next stage.
FROM docker.io/library/python:3.10 as back-build
WORKDIR /code
RUN pip install poetry~=1.1
# Install dependencies and dev dependencies (keep venv inside /code/ because it's simpler)
COPY back/pyproject.toml back/poetry.lock /code/
RUN poetry config virtualenvs.in-project true \
  && poetry install --no-dev --no-interaction --no-ansi

# App container.
# Minimal container that contains both the frontend and backend, and gets uploaded to Kubernetes
FROM docker.io/library/python:3.10-slim as app
WORKDIR /code
COPY back/pyproject.toml back/poetry.lock /code/
COPY --from=back-build /code/.venv /code/.venv
COPY --from=front-build /code/www/ /code/static/front
COPY /back/tmeit_backend /code/tmeit_backend
CMD ["/code/.venv/bin/uvicorn", "tmeit_backend.app_root:app", "--host", "0.0.0.0", "--port", "8080", "--forwarded-allow-ips='*'"]
