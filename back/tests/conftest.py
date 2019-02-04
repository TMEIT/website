import pytest
import os

from tests.dummy_entries import TEST_TEAM_NAME, TEST_SYMBOL, TEST_ACTIVE, TEST_ACTIVE_YEAR, TEST_ACTIVE_PERIOD, \
    TEST_EMAIL, TEST_FIRST_NAME, TEST_NICKNAME, TEST_LAST_NAME, TEST_PHONE, TEST_DRIVERS_LICENSE, TEST_STAD, TEST_FEST, \
    TEST_LIQUOR_PERMIT, TEST_CURRENT_ROLE
from tmeit_backend import models


@pytest.fixture(scope="session")
def dummy_database(tmp_path_factory):
    """Creates a dummy database in a tmpdir for testing."""

    # Put Flask into testing mode and set the database to use the temp file
    os.environ["FLASK_TESTING"] = "true"
    from tmeit_backend import flask_cfg
    flask_cfg.TestingConfig.SQLALCHEMY_DATABASE_URI = \
        'sqlite:///{}database.sqlite3'.format(tmp_path_factory.mktemp("db"))

    from tmeit_backend import app

    models.db.create_all(app=app.app)

    test_team = models.Workteam(
        name=TEST_TEAM_NAME,
        symbol=TEST_SYMBOL,
        active=TEST_ACTIVE,
        active_year=TEST_ACTIVE_YEAR,
        active_period=TEST_ACTIVE_PERIOD
    )

    test_user = models.Member(
        email=TEST_EMAIL,
        first_name=TEST_FIRST_NAME,
        nickname=TEST_NICKNAME,
        last_name=TEST_LAST_NAME,
        phone=TEST_PHONE,
        drivers_license=TEST_DRIVERS_LICENSE,
        stad=TEST_STAD,
        fest=TEST_FEST,
        liquor_permit=TEST_LIQUOR_PERMIT,
        current_role=TEST_CURRENT_ROLE,
        workteams=[test_team],
        workteams_leading=[test_team]
    )

    with app.app.app_context():
        models.db.session.add(test_team)
        models.db.session.add(test_user)
        models.db.session.commit()

    return app.app
