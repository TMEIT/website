import configparser

from fastapi import APIRouter
from pydantic import BaseModel


# TODO: temporary until we have Kubernetes API integration
PYPROJECT_TOML_PATH = "/code/pyproject.toml"


router = APIRouter()


class VersionResponse(BaseModel):
    backend: str

    # TODO: future
    # Use kubernetes api to read version data from deployments/pods
    # postgres: str
    # frontend: str
    # kubernetes_api: str
    # kernel: str
    # redis?


def get_backend_version() -> str:
    pyproject = configparser.ConfigParser()
    pyproject.read(PYPROJECT_TOML_PATH)
    return pyproject['tool.poetry']['version'].strip('"')


@router.get("/version",  response_model=VersionResponse)
def get_version():
    backend_version = get_backend_version()
    return VersionResponse(backend=backend_version)
