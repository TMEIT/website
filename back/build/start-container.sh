#!/usr/bin/env bash

docker run --rm \
--user $(id -u):$(id -g) \
-v /var/home/jlh/Documents/git/website/back/tests:/root/back/tests:z \
-v /var/home/jlh/Documents/git/website/back/tmeit_backend:/root/back/tmeit_backend:z \
-e FLASK_APP="tmeit_backend.api_app:create_app('sqlite:////root/back/database.sqlite3', True, False)" \
-e FLASK_ENV=development \
tmeit_backend-dev \
poetry run "$@"