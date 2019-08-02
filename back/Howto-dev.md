# Creating and running a dev environment

The development environment is containerized. There are shell scripts in the `build/` directory for building and running backend Docker containers locally.

The scripts can also be adapted to use Podman pods for a simpler dev environment if wanted. Docker is only used here because Pycharm doesn't integrate with any other container ecosystems.  

## Build dev container
```bash
exec build/local-dev/build-dev.sh
```

## Run tests
```bash
exec build/local-dev/run-tests.sh
```

## Start dev server
```bash
exec build/local-dev/start-dev.sh
```

# Adding or updating dependencies
The backend dependencies are managed using [Poetry](https://poetry.eustace.io/). The Docker container handles installing dependencies by itself, but if you want to make changes to the dependencies, you'll have to also install Poetry locally.

## Install Poetry
Currently we run the v1.0 prerelease of Poetry because it handles Python3 better, so you'll need to manually specify the prerelease version of Poetry to match.
```bash
pip3 install --user poetry==1.0.0a5
```

## Modify dependencies
The best way to add or modify the dependencies is to manually set them in `pyproject.toml`. You could also use the `poetry add` command, but it also installs the packages outside the container, which is a pain. It's pretty simple to set dependencies in `pyproject.toml`, and you can use the [Python Package Index](https://pypi.org/) for searching and referencing packages.
