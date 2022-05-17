
## Adding or updating dependencies
The backend dependencies are managed using [Poetry](https://python-poetry.org/).

The OCI container at `/Containerfile` handles installing dependencies by itself, 
but if you want to make changes to the dependencies, 
you'll have to also install Poetry locally.

### Install Poetry
```bash
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python
```
or if on Fedora Linux:
```bash
sudo dnf install poetry
```
