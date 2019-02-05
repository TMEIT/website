import pytest

from tmeit_backend import models,api_app

@pytest.fixture
def app():
    app = api_app.create_app('sqlite://', debug=True, testing= True)
    models.db.create_all(app=app)
    return app

@pytest.fixture
def app_with_testingdb():
    app = api_app.create_app('sqlite:///testing.sqlite3', debug=True, testing=True)
    return app
