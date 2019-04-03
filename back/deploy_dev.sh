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

echo $SFTP_KEY > /tmp/sftp_key

# Upload Python code to server
# https://stackoverflow.com/questions/14019890/uploading-all-of-files-in-my-local-directory-with-curl
find tmeit_backend -type f -exec curl --ftp-create-dirs --key /tmp/sftp_key -T {} \
    sftp://$SSH_CONNECTION/www-tmeit/development/py/tmeit_backend/{} \;

# Touch reload-uwsgi on server to reload python code
touch /tmp/reload-uwsgi
curl --ftp-create-dirs --key /tmp/sftp_key --upload-file /tmp/reload-uwsgi \
    sftp://$SSH_CONNECTION/www-tmeit/development/reload-uwsgi
