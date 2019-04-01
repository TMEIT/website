#!/bin/bash
# docker_push_dev.sh
# Builds dev version of backend docker container and pushes to Docker Hub

# Truncate commit hash to 7 chars
tag=`echo "$TRAVIS_COMMIT" | sed "s/^\(.......\).*/\1/"`

# Build and tag with commit hash
docker build -t justinlex/tmeit-website-dev:$tag .

# Tag with :latest
docker tag justinlex/tmeit-website-dev:$tag justinlex/tmeit-website-dev:latest

# Login to Docker hub and deploy
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push justinlex/tmeit-website-dev

