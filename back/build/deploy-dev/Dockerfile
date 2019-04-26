# Based on https://medium.com/@greut/minimal-python-deployment-on-docker-with-uwsgi-bc5aa89b3d35

FROM alpine

EXPOSE 3031
WORKDIR /srv/api

RUN addgroup -S tmeit-website && adduser -S tmeit-wsgi

# Install system packages
# Note: libxml and libxmlsec are dependencies for the python3-saml package.
RUN apk add --no-cache \
        uwsgi-python3 \
        python3 \
        libxml2-dev \
        xmlsec-dev


RUN pip3 install poetry==1.0.0a5

# Copy dependency list
COPY pyproject.toml poetry.lock ./

USER tmeit-wsgi:tmeit-website

# Install dependencies
RUN poetry install

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
