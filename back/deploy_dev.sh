#!/bin/bash
# docker_push_dev.sh
# Builds dev version of backend docker container and pushes to Docker Hub

# Truncate commit hash to 7 chars
tag=`echo "$TRAVIS_COMMIT" | sed "s/^\(.......\).*/\1/"`

# Build and tag with commit hash
docker build -t justinlex/tmeit-website-dev:$tag .

# Tag with :latest
docker tag justinlex/tmeit-website-dev:$tag justinlex/tmeit-website-dev:latest

# Login to Docker hub and deploy container
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push justinlex/tmeit-website-dev

echo "-----BEGIN OPENSSH PRIVATE KEY-----" > /tmp/sftp_key
echo $SFTP_KEY >> /tmp/sftp_key
echo "-----END OPENSSH PRIVATE KEY-----" >> /tmp/sftp_key
chmod 600 /tmp/sftp_key

# Upload Python code to server
sftp -i /tmp/sftp_key -o StrictHostKeyChecking=no $SSH_CONNECTION:/www-tmeit/development/py/ <<< $'put -r tmeit_backend'

# Touch reload-uwsgi on server to reload python code
touch /tmp/reload-uwsgi
sftp -i /tmp/sftp_key  -o StrictHostKeyChecking=no $SSH_CONNECTION:/www-tmeit/development/ <<< $'put /tmp/reload-uwsgi'

