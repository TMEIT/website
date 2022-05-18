# This Containerfile (aka a Dockerfile) builds the container image for the app.

# Frontend builder/tester.
# Installs frontend build deps, tests the frontend, and then compiles/minifies the frontend.
FROM docker.io/library/node:18-alpine as front-buildtest
# Temporary workwaround for Node 18 until we update the app
ENV NODE_OPTIONS=--openssl-legacy-provider
WORKDIR /code
COPY front/package.json front/package-lock.json /code/
RUN npm install --silent
COPY front/ /code/
RUN npm run-script build:prod

# Backend builder/tester.
# Installs backend deps, and then tests the backend.
# Precompiled deps in .venv can be copied to next stage.
FROM docker.io/library/python:3.10-slim as back-buildtest
WORKDIR /code
RUN pip install poetry~=1.1
# Install dependencies and dev dependencies (keep venv inside /code/ because it's simpler)
COPY back/pyproject.toml back/poetry.lock /code/
RUN poetry config virtualenvs.in-project true \
  && poetry install --no-interaction --no-ansi
# Copy backend app into container
COPY back/tmeit_backend /code/tmeit_backend
# Run tests (Devs must pass all automated tests before doing live testing!)
COPY back/tests /code/tests
RUN /code/.venv/bin/pytest tests/
# Uninstall dev dependencies from .venv, so that they don't get transferred to final app container
RUN poetry install --no-dev --no-interaction --no-ansi

# App container.
# Minimal container that contains both the frontend and backend, and gets uploaded to Kubernetes
FROM docker.io/library/python:3.10-slim as app
WORKDIR /code
COPY --from=front-buildtest /code/www/ /code/static/front
COPY --from=back-buildtest /code/tmeit_backend /code/tmeit_backend
COPY --from=back-buildtest /code/.venv /code/.venv
CMD ["/code/.venv/bin/uvicorn", "tmeit_backend.app_root:app", "--host", "0.0.0.0", "--port", "80"]
