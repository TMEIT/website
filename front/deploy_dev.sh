#!/bin/bash
# docker_push_dev.sh
# Builds dev version of React app and uploads it to the TMEIT server

npm run-script build:prod

echo $SFTP_KEY > /tmp/sftp_key

# Upload html and js code to server
sftp -i /tmp/sftp_key -o StrictHostKeyChecking=no $SSH_CONNECTION:/www-tmeit/development/ <<< $'put -r www'
