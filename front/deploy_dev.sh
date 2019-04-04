#!/bin/bash
# docker_push_dev.sh
# Builds dev version of React app and uploads it to the TMEIT server

npm run-script build:prod

echo $SFTP_KEY > /tmp/sftp_key

# Upload html and js code to server
# https://stackoverflow.com/questions/14019890/uploading-all-of-files-in-my-local-directory-with-curl
find dist -type f -exec curl --ftp-create-dirs --key /tmp/sftp_key -T {} \
    sftp://$SSH_CONNECTION/www-tmeit/development/www/{} \;
