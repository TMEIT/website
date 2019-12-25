from flask import url_for, testing, wrappers

from tmeit_backend import dummy_entries, models


def test_get_member_detail_noauth(client: testing.FlaskClient):
    r: wrappers.Response = client.get(url_for('model_endpoints.member_detail', email=dummy_entries.TEST_EMAIL))
    assert r.status_code == 200
    o: dict = r.json
    assert o['email'] == dummy_entries.TEST_EMAIL
    assert o['first_name'] == dummy_entries.TEST_FIRST_NAME
    assert o['current_role'] == dummy_entries.TEST_CURRENT_ROLE.name

    # Make sure we don't leak password hashes
    assert o.get('password_hash') is None
    assert dummy_entries.TEST_PASSWORD_HASH not in r.data.decode('utf-8')