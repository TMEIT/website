import os

import pytest
from fastapi.testclient import TestClient


@pytest.fixture(scope="module")
def client():

    # Init app
    os.environ['POSTGRES_PASSWORD'] = ''
    os.environ['JWT_KEY'] = ''
    from tmeit_backend import app_api
    app = app_api.app

    return TestClient(app)


def test_version_endpoint(client):
    response = client.get(url="/version")

    assert response.status_code == 200
    assert "backend" in response.json()
