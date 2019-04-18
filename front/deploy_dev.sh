#!/bin/bash
# docker_push_dev.sh
# Builds dev version of React app and uploads it to the TMEIT server

npm install
npm run-script build:prod

echo "-----BEGIN OPENSSH PRIVATE KEY-----" > /tmp/sftp_key
echo $SFTP_KEY >> /tmp/sftp_key
echo "-----END OPENSSH PRIVATE KEY-----" >> /tmp/sftp_key
chmod 600 /tmp/sftp_key

# Upload html and js code to server
sftp -i /tmp/sftp_key -o StrictHostKeyChecking=no $SSH_CONNECTION:/www-tmeit/development/ <<< $'put -r www'
