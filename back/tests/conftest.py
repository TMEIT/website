import pytest

from tmeit_backend import models, api_app, dummy_entries


def create_test_db(app):
    """
    Creates a test database using the given app
    """
    with app.app_context():
        models.db.create_all()

    test_team = models.Workteam(
        name=dummy_entries.TEST_TEAM_NAME,
        symbol=dummy_entries.TEST_SYMBOL,
        active=dummy_entries.TEST_ACTIVE,
        active_year=dummy_entries.TEST_ACTIVE_YEAR,
        active_period=dummy_entries.TEST_ACTIVE_PERIOD
    )

    test_user = models.Member(
        email=dummy_entries.TEST_EMAIL,
        first_name=dummy_entries.TEST_FIRST_NAME,
        nickname=dummy_entries.TEST_NICKNAME,
        last_name=dummy_entries.TEST_LAST_NAME,
        phone=dummy_entries.TEST_PHONE,
        drivers_license=dummy_entries.TEST_DRIVERS_LICENSE,
        stad=dummy_entries.TEST_STAD,
        fest=dummy_entries.TEST_FEST,
        liquor_permit=dummy_entries.TEST_LIQUOR_PERMIT,
        current_role=dummy_entries.TEST_CURRENT_ROLE,
        workteams=[test_team],
        workteams_leading=[test_team]
    )

    with app.app_context():
        models.db.session.add(test_team)
        models.db.session.add(test_user)
        models.db.session.commit()


@pytest.fixture
def app_nodb():
    """
        Creates an app session for testing, using an empty db in memory.
        app = api_app.create_app('sqlite:///{}/testing.sqlite3'.format(tmp_path), debug=True, testing=True)
    """
    app = api_app.create_app('sqlite://', debug=True, testing=True)

    with app.app_context():
        models.db.create_all()

    return app


@pytest.fixture(scope="session")
def app(tmp_path_factory):
    """
    Creates an app session for testing, and creates and uses a new database file with a test workteam and user.
    """
    tmp_path = tmp_path_factory.mktemp("tmeit-db")
    app = api_app.create_app('sqlite:///{}/testing.sqlite3'.format(tmp_path), debug=True, testing=True)

    create_test_db(app)
    return app
