FROM fedora:latest

WORKDIR /root/back

RUN dnf -y update

# Note: these are needed to build the python3-saml pip package during poetry install.
RUN dnf -y install \
    gcc \
    python3-devel \
    libtool-ltdl-devel \
    xmlsec1-devel \
    xmlsec1-openssl \
    libxml2-devel
RUN dnf clean all

RUN pip3 install poetry==1.0.0a5

# Workaround for a bug in Poetry 1.0.0a5 https://github.com/sdispater/poetry/issues/1179
RUN mkdir -p /root/.config/pypoetry/
# Make root and the dev user have the same venvs, also prevents issue with dev user not having a home folder
RUN poetry config settings.virtualenvs.in-project true

COPY pyproject.toml poetry.lock /root/back/
RUN chmod -R 777 /root

RUN poetry install