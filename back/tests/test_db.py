from tests import dummy_entries
from tmeit_backend import models


def test_gen_db_and_retrieve(app):
    """Test that we can start from an empty database in memory and create our tables, and put data into it."""

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

    models.db.session.add(test_team)
    models.db.session.add(test_user)
    models.db.session.commit()

    assert models.Workteam.query.filter_by(name=dummy_entries.TEST_TEAM_NAME).first().symbol == dummy_entries.TEST_SYMBOL
    assert models.Member.query.get(dummy_entries.TEST_EMAIL).first_name == dummy_entries.TEST_FIRST_NAME


def test_access_file_db(app_with_testingdb):
    """Test that we can get data from our file-DB, testing.sqlite3"""
    with app_with_testingdb.app_context():
        assert models.Member.query.get(dummy_entries.TEST_EMAIL).first_name == dummy_entries.TEST_FIRST_NAME
