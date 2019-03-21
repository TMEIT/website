# Taken from https://medium.com/@greut/minimal-python-deployment-on-docker-with-uwsgi-bc5aa89b3d35
FROM alpine

EXPOSE 3031
WORKDIR /srv/api

RUN addgroup -S tmeit-website && adduser -S tmeit-wsgi

RUN apk add --no-cache \
        uwsgi-python3 \
        python3

# Install dependencies
COPY requirements.txt requirements.txt
RUN pip3 install --quiet --no-cache-dir -r requirements.txt

# Install backend package
COPY setup.py setup.py
COPY tmeit_backend tmeit_backend
RUN pip3 install --quiet --no-cache-dir .

# rm src files
RUN rm -r setup.py tmeit_backend requirements.txt

USER tmeit-wsgi:tmeit-website

CMD [ "uwsgi", "--master", \
               "--protocol", "uwsgi", \
               "--socket", "0.0.0.0:3031", \
               "--plugins", "python3", \
               "--wsgi", "tmeit_backend.wsgi"]
