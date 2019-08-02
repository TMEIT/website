from tmeit_backend import models, dummy_entries


def test_access_db(app):
    """Test that we can get data from our DB"""
    with app.app_context():
        assert models.Member.query.get(dummy_entries.TEST_EMAIL).first_name == dummy_entries.TEST_FIRST_NAME
