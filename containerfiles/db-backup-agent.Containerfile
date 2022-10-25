# A container image for backing up postgres databases to Backblaze B2

FROM docker.io/library/postgres:15-alpine3.16

RUN apk add curl xz

RUN curl -o b2 https://github.com/Backblaze/B2_Command_Line_Tool/releases/download/v3.6.0/b2-linux
RUN chmod 755 b2
