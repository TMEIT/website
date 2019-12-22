import pytest

from tmeit_backend import models, app, dummy_entries

@pytest.fixture(scope="session")
def app(tmp_path_factory):
    """
    Creates an app session for testing, and creates and uses a new database file with a test workteam and user.
    """
    tmp_path = tmp_path_factory.mktemp("tmeit-db")
    app = app.create_app('sqlite:///{}/testing.sqlite3'.format(tmp_path), debug=True, testing=True)
    return app
