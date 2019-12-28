from flask import url_for, testing, wrappers
import pytest

from tmeit_backend import models, auth, model_fixtures


# Data to use for our test user
EMAIL = "abc@gmail.com"
FIRST_NAME = "abe"
CURRENT_ROLE = models.CurrentRoleEnum.marshal


@pytest.fixture(scope='function')
def dummy_member_id(app):
    """Sets up a database with a user for us to test."""
    with app.app_context():
        member = model_fixtures.MemberFactory(email=EMAIL,
                                              first_name=FIRST_NAME,
                                              current_role=CURRENT_ROLE,
                                              role_histories=[])
        models.db.session.commit()
        return member.id


def test_get_member_detail_noauth(client: testing.FlaskClient, dummy_member_id: int):
    with client.application.app_context():
        # Generate a single role history for the dummy member
        role_history = model_fixtures.RoleHistoryFactory(owner_id=dummy_member_id)
        models.db.session.commit()

        # Basic testing of endpoint
        r: wrappers.Response = client.get(url_for('model_endpoints.member_detail', id=dummy_member_id))
        assert r.status_code == 200
        o: dict = r.json
        assert o['email'] == EMAIL
        assert o['first_name'] == FIRST_NAME
        assert o['current_role'] == CURRENT_ROLE.name

        # Test role history nesting
        assert o['role_histories'][0]['owner'] == dummy_member_id
        assert o['role_histories'][0]['role'] == role_history.role.name
        assert o['role_histories'][0]['start_date'] == str(role_history.start_date)
        assert o['role_histories'][0]['end_date'] == str(role_history.end_date)

        # Make sure we don't leak password hashes
        assert o.get('password_hash') is None
        assert models.Member.query.get(dummy_member_id).password_hash not in r.data.decode('utf-8')


def test_set_member_detail_auth(client: testing.FlaskClient, dummy_member_id: int):
    with client.application.app_context():
        auth_member = models.Member.query.get(dummy_member_id)
        payload = {
            'email': 'abc@butt',
            'auth': auth.generate_jwt(auth_member)
        }
    r: wrappers.Response = client.post(url_for('model_endpoints.member_detail', id=dummy_member_id),
                                       json=payload)
    assert r.status_code == 200
    assert r.json['email'] == 'abc@butt'

# TODO: More testing
