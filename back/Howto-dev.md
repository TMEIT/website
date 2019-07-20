# Creating and running a dev environment

The development environment is containerized. There are shell scripts in the `build/` directory for building and running\
backend Docker containers.

The scripts can also be adapted to use Podman pods for a simpler dev environment if wanted. Docker is only used here\
because Pycharm doesn't integrate with any other container ecosystems.  

## Build dev container
```bash
exec build/build-dev.sh
```

## Run tests
```bash
exec build/run-tests.sh
```

## Start dev server
```bash
exec build/start-dev.sh
```

### SELinux permission issues
Note that if you have SELinux enabled and you're running inside Docker, you may have to set SELinux to permissive. Do\
this if you're unable to read source files from inside the Docker container. The command is `sudo setenforce permissive`.
This is necessary because the container needs to be able to mount and read the source code, and SELinux normally blocks\
Docker from accessing these files in my experience.
TODO: Maybe make a custom SELinux rule for this?
**Actually this might be solved with a :z mount**

# Adding or updating dependencies
The backend dependencies are managed using [Poetry](https://poetry.eustace.io/). The Docker container handles installing\
dependencies by itself, but if you want to make changes to the dependencies, you'll have to also install Poetry locally.

## Install Poetry
Currently we run the v1.0 prerelease of Poetry because it handles Python3 better, so you'll need to manually specify the\
prerelease version of Poetry to match.
```bash
pip3 install --user poetry==1.0.0a5
```

## Modify dependencies
Poetry has commands for adding new dependencies, a la NPM. However, in order to use those commands, you need to install \
poetry outside the docker containers and poetry will also waste time installing the dependencies outside. It's probably \
easier to just modify the dependency lists inside `pyproject.toml`. It's pretty simple, and you can use the \
[Python Package Index](https://pypi.org/) for searching and referencing packages.
