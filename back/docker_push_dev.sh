#!/bin/bash
docker build -t justinlex/tmeit-website-dev:$TRAVIS_COMMIT .
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push justinlex/tmeit-website-dev

