# Test the backend's authentication handling inside back/auth.py

import pytest
import os
import flask
import jwt

from tmeit_backend import api_app, auth, models

EXPIRED_GOOGLE_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjZmYjA1Zjc0MjM2NmVlNGNmNGJjZjQ5Zjk4NGM0ODdlNDVjOGM4M2QiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNDk3MTA3NTAwNzA1LW5nc21paXFpM3A2cjFsNXBwMGdwZmduZnFmN2I4amNiLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNDk3MTA3NTAwNzA1LW5nc21paXFpM3A2cjFsNXBwMGdwZmduZnFmN2I4amNiLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA5NzcwOTQ5ODY5ODk4NjkyMjgxIiwiZW1haWwiOiJ0ZXN0dG1laXRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJjT0tMeHZtMjNRQUlQM2xZQ3FQOXRBIiwibmFtZSI6IlRlc3QgVE1FSVQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1PVkdGY2NBUk1LZy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BQ2V2b1FOam5zcjNhcjZiVWVZZHI2cnJJTjZSRG1YMUFBL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJUZXN0IiwiZmFtaWx5X25hbWUiOiJUTUVJVCIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNTQ5Mjk0NDQ4LCJleHAiOjE1NDkyOTgwNDgsImp0aSI6ImY4NjBjYjAxYjZjMDE3OGVjMzZlNzVhYmM1YjAzM2E1OTJlNDBjZGMifQ.CuK1JkSmF4IOhNOq_fFhG_Y5AD6BHsNCnBjgQjE80oAajcpMFS2_VpPORzi8NrW8cgExyTd1zqs63LcaaFR1NPIu6mTA4b4YWYRdw9uhkD2em1cXAlCaRlyX4nFh_pUSNmi_q1ANOoyxaDkQo2-nr43DoZUM8gSTs2bXDZVaIrrE7Lf1JYFfw9xyGNYlrmzkzAGm9cLxddwEE93kZF3_6waF0MYVDUnLtzYw4rVPz-3DBNQGZRwnySY9QRv-ZCmUBV6rmZaQZSPAmO5bkXf9CTrBW7baIQsnaD5DoxxL1kQL1OBmMVTDvPCc6aoR-YdyFibRi5j-dEFr5cdasGExHg"

class TestSecret:
    """Tests that secrets are being used and their security is verified."""

    def test_no_secret(self, tmp_path):
        """Tests that we're checking for a valid secret when loading in production"""

        os.chdir(tmp_path)
        with pytest.raises(FileNotFoundError):
            api_app.create_app('sqlite://', debug=False, testing=False)

    def test_weak_secret(self, tmp_path):
        """Tests that we're checking for a strong secret when loading in production"""

        os.chdir(tmp_path)
        with open('jwt_secret.txt', 'w') as secret_file:
            secret_file.write("too short secret not secure")
        with pytest.raises(RuntimeError):
            api_app.create_app('sqlite://', debug=False, testing=False)

    def test_secret_loading(self, tmp_path):
        """tests that secret loads properly"""
        KEY = "a long secure secret that is sufficiently random"
        os.chdir(tmp_path)
        with open('jwt_secret.txt', 'w') as secret_file:
            secret_file.write(KEY)
        app = api_app.create_app('sqlite://', debug=False, testing=False)
        assert app.config['JWT_SECRET_KEY'] == KEY


class TestLogin(object):
    def test_expired_google_token(self, client):
        """Tests that we reject invalid Google tokens"""
        payload = {'access_token': EXPIRED_GOOGLE_TOKEN}
        r = client.post(flask.url_for('login_page.login'), json=payload)
        assert r.status_code == 401
        assert r.json['msg'] == 'This Google JWT is invalid.'

    def test_unregistered_user(self, client, monkeypatch):
        """Tests that we reject unregistered users"""
        # Patch over token verification
        monkeypatch.setattr(auth, 'verify_google_token', TestLogin.mock_external_token_verification)
        payload = {'access_token': EXPIRED_GOOGLE_TOKEN}
        r = client.post(flask.url_for('login_page.login'), json=payload)
        assert r.status_code == 403
        assert r.json['msg'] == "Test Tmeit (testtmeit@gmail.com) is not registered"

    def test_jwt_generation(self, app_with_testingdb, monkeypatch):
        """Tests that we're able to generate valid jwt tokens"""
        # Patch over token verification
        monkeypatch.setattr(auth, 'verify_google_token', TestLogin.mock_external_token_verification)
        app_with_testingdb.config['SERVER_NAME'] = 'localhost:5000'
        client = app_with_testingdb.test_client()
        payload = {'access_token': EXPIRED_GOOGLE_TOKEN}
        with app_with_testingdb.app_context():
            r = client.post(flask.url_for('login_page.login'), json=payload)
        assert r.status_code == 200
        config = app_with_testingdb.config
        token = jwt.decode(r.json['access_token'], key=config['JWT_SECRET_KEY'],
                   issuer=config['JWT_ISSUER'], algorithms=config['JWT_ALGORITHM'])
        assert token['sub'] == 'testtmeit@gmail.com'

    @staticmethod
    def mock_external_token_verification(self):
        """Function that can be monkeypatched over external token verification to act like it was given a valid token"""
        return {'email': 'testtmeit@gmail.com',
                'name': 'Test Tmeit'}
