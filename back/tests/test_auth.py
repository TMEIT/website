# Test the backend's authentication handling inside back/auth.py

import pytest
import os
import flask
import jwt

from tmeit_backend import main, auth, models, dummy_entries


class TestSecret:
    """Tests that secrets are being used and their security is verified."""

    def test_no_secret(self, tmp_path):
        """Tests that we're checking for a valid secret when loading in production"""
        os.chdir(tmp_path)
        with pytest.raises(FileNotFoundError):
            main.create_app('sqlite://', debug=False, testing=False)

    def test_weak_secret(self, tmp_path):
        """Tests that we're checking for a strong secret when loading in production"""
        os.chdir(tmp_path)
        with open('jwt_secret.txt', 'w') as secret_file:
            secret_file.write("too short secret not secure")
        with pytest.raises(RuntimeError):
            main.create_app('sqlite://', debug=False, testing=False)

    def test_secret_loading(self, tmp_path):
        """tests that secret loads properly"""
        KEY = "a long secure secret that is sufficiently random"
        os.chdir(tmp_path)
        with open('jwt_secret.txt', 'w') as secret_file:
            secret_file.write(KEY)
        app = main.create_app('sqlite://', debug=False, testing=False)
        assert app.config['JWT_SECRET_KEY'] == KEY


class TestLogin(object):
    def test_login(self, client):
        payload = {
            'email': dummy_entries.TEST_EMAIL,
            'password': dummy_entries.PASSWORD
        }

        r = client.post(flask.url_for('login_page.login'), json=payload)
        assert r.status_code is 200
        assert auth.verify_token(r.json['access_token']) == models.Member.query.get(dummy_entries.TEST_EMAIL)
