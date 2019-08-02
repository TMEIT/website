# Based on https://medium.com/@greut/minimal-python-deployment-on-docker-with-uwsgi-bc5aa89b3d35

FROM alpine

EXPOSE 3031
WORKDIR /srv/api

RUN addgroup -S tmeit-website && adduser -S tmeit-wsgi

RUN apk add --no-cache \
        uwsgi-python3 \
        python3

# Install dependencies
COPY ../../requirements.txt requirements.txt
RUN pip3 install --quiet --no-cache-dir -r requirements.txt

USER tmeit-wsgi:tmeit-website

CMD [ "uwsgi", "--master", \
               "--touch-reload", "/srv/api/reload-uwsgi", \
               "--protocol", "uwsgi", \
               "--socket", "0.0.0.0:3031", \
               "--plugins", "python3", \
               "--wsgi-file", "/srv/api/tmeit_backend/wsgi.py"]

# Note: Make sure to mount the following files and directories for the container to work:
# /srv/api/jwt_secret.txt
# /srv/api/database.sqlite3
# /srv/api/tmeit_backend/
# /srv/api/reload-uwsgi
