from flask import url_for, testing, wrappers
import pytest

from tmeit_backend import models, auth, model_fixtures


# Data to use for our test user
EMAIL = "abc@gmail.com"
FIRST_NAME = "abe"
CURRENT_ROLE = models.CurrentRoleEnum.marshal


@pytest.fixture(scope='function', autouse=True)
def create_user(app):
    """Sets up a database with a user for us to test."""
    with app.app_context():
        model_fixtures.MemberFactory(email=EMAIL,
                                     first_name=FIRST_NAME,
                                     current_role=CURRENT_ROLE)
        models.db.session.commit()


def test_get_member_detail_noauth(client: testing.FlaskClient):
    r: wrappers.Response = client.get(url_for('model_endpoints.member_detail', email=EMAIL))
    assert r.status_code == 200
    o: dict = r.json
    assert o['email'] == EMAIL
    assert o['first_name'] == FIRST_NAME
    assert o['current_role'] == CURRENT_ROLE.name

    # Make sure we don't leak password hashes
    assert o.get('password_hash') is None
    assert models.Member.query.get(EMAIL).password_hash not in r.data.decode('utf-8')


def test_set_member_detail_auth(client: testing.FlaskClient):
    payload = {
        'email': 'abc@butt',
        'auth': auth.generate_jwt({'email': EMAIL, 'name': 'lol'})
    }
    r: wrappers.Response = client.post(url_for('model_endpoints.member_detail', email=EMAIL,),
                                       json=payload)
    assert r.status_code == 200
    assert r.json['email'] == 'abc@butt'

# TODO: More testing
