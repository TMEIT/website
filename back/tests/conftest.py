import pytest

from tmeit_backend import models, main, dummy_entries

@pytest.fixture(scope="session")
def app(tmp_path_factory):
    """
    Creates an app session for testing, and creates and uses a new database file with a test workteam and user.
    """
    app = main.create_app('sqlite://', debug=True, testing=True)
    return app
