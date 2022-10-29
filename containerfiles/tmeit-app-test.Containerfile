# This Containerfile (aka a Dockerfile) builds a container image that can be used for testing the app.

FROM docker.io/library/python:3.10
WORKDIR /code

# Install Node and frontend deps
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash \
    && . /root/.nvm/nvm.sh && nvm install 18
COPY front/package.json front/package-lock.json /code/
RUN . /root/.nvm/nvm.sh && npm install --silent

# Install backend deps
RUN pip install poetry~=1.2
COPY back/pyproject.toml back/poetry.lock /code/
RUN poetry config virtualenvs.in-project true \
  && poetry install --no-interaction --no-ansi

# copy front/ and back/ dirs to code/
COPY front/src/ /code/src/
COPY front/webpack.config.js /code/
COPY back/ /code/

# TODO: Add frontend tests
CMD ["/code/.venv/bin/pytest", "tests/"]


