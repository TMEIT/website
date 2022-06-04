import os
from unittest.mock import Mock

import pytest
from fastapi.testclient import TestClient
from jose import jwt
from sqlalchemy.sql import Select

from tmeit_backend import auth

GOOD_EMAIL = "alice@tmeit.se"
USER_NO_PASSWORD = "bob@tmeit.se"
BAD_EMAIL = "eve@qmisk.se"
GOOD_PASSWORD = "much secure"
BAD_PASSWORD = "uruselt"


@pytest.fixture(scope="module")
def test_client_with_fake_db():
    os.environ['POSTGRES_PASSWORD'] = ''
    os.environ['JWT_KEY'] = ''
    from tmeit_backend import app_api

    app = app_api.app

    client = TestClient(app)

    good_hash = auth.ph.hash(GOOD_PASSWORD)

    async def override_get_db():
        async def fake_execute(stmt: Select):
            """Mock successful query, unless function-under-test searched for the bad email """
            rows = Mock()
            rows.fetchone.return_value.Member.login_email = GOOD_EMAIL
            rows.fetchone.return_value.Member.hashed_password = good_hash

            email_param = list(stmt.compile().params.values())[0]
            if email_param == BAD_EMAIL:
                rows.fetchone.return_value = None
            elif email_param == USER_NO_PASSWORD:
                rows.fetchone.return_value.Member.hashed_password = None
            return rows

        fake_db = Mock()
        fake_db.execute = fake_execute
        return fake_db

    app.dependency_overrides[app_api.get_db] = override_get_db

    return client


def test_login_for_access_token(test_client_with_fake_db):
    response = test_client_with_fake_db.post(url="/token",
                                             data={"username": GOOD_EMAIL,
                                                   "password": GOOD_PASSWORD})
    assert response.status_code == 200
    claims = jwt.get_unverified_claims(response.json()['access_token'])
    assert claims['sub'] == "email:" + GOOD_EMAIL


def test_login_for_access_token_wrong_username(test_client_with_fake_db):
    response = test_client_with_fake_db.post(url="/token",
                                             data={"username": BAD_EMAIL,
                                                   "password": GOOD_PASSWORD})
    assert response.status_code == 401


def test_login_for_access_token_wrong_password(test_client_with_fake_db):
    response = test_client_with_fake_db.post(url="/token",
                                             data={"username": GOOD_EMAIL,
                                                   "password": BAD_PASSWORD})
    assert response.status_code == 401


def test_login_for_access_token_no_hash_in_db(test_client_with_fake_db):
    response = test_client_with_fake_db.post(url="/token",
                                             data={"username": USER_NO_PASSWORD,
                                                   "password": GOOD_PASSWORD})
    assert response.status_code == 401
