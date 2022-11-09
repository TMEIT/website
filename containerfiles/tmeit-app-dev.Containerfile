# This Containerfile builds the app container for use with the Tilt developer environment.
# It contains both the frontend and backend tooling to allow for the use of live_update
# This containerfile also compiles the frontend in dev mode for better debugging.

FROM docker.io/library/python:3.10-slim

ENV NODE_OPTIONS=--openssl-legacy-provider
WORKDIR /code

# Install gcc and curl
RUN apt update -q && apt install gcc curl -yq

# Install node
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install python deps
RUN python3 -m pip install poetry~=1.2 watchfiles

# Install backend deps
COPY back/pyproject.toml back/poetry.lock /code/
RUN poetry config virtualenvs.in-project true \
    && poetry install --only main --no-interaction --no-ansi

# Install frontend deps
COPY front/package.json front/package-lock.json /code/
RUN npm install --silent

# Build frontend
COPY front/src/ /code/src/
COPY front/webpack.config.js /code/
RUN npm run-script build

# Install backend code
COPY back/tmeit_backend /code/tmeit_backend

CMD ["/code/.venv/bin/uvicorn", "tmeit_backend.app_root:app", "--host", "0.0.0.0", "--port", "8080", "--forwarded-allow-ips='*'", "--reload", "--reload-exclude", "./node_modules/*"]
