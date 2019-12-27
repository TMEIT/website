from tmeit_backend import models, model_fixtures


def test_access_db(app):
    """Test that we can get data from our DB"""

    # Example data for our test user
    email = "abc@gmail.com"
    first_name = 'abe'

    # create test user
    with app.app_context():
        model_fixtures.MemberFactory(email=email, first_name=first_name)
        models.db.session.commit()

    assert models.Member.query.get(email).first_name == first_name
