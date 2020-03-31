# Test the backend's authentication handling inside back/auth.py

import os

import pytest
from flask import testing, url_for, wrappers

from tmeit_backend import main, auth, models, model_fixtures


class TestSecret:
    """Tests that secrets are being used and their security is verified."""

    def test_no_secret(self, tmp_path):
        """Tests that we're checking for a valid secret when loading in production"""
        os.chdir(tmp_path)
        with pytest.raises(FileNotFoundError):
            main.create_app('sqlite://', debug=False, testing=True)

    def test_weak_secret(self, tmp_path):
        """Tests that we're checking for a strong secret when loading in production"""
        os.chdir(tmp_path)
        with open('jwt_secret.txt', 'w') as secret_file:
            secret_file.write("too short secret not secure")
        with pytest.raises(RuntimeError):
            main.create_app('sqlite://', debug=False, testing=True)

    def test_secret_loading(self, tmp_path):
        """tests that secret loads properly"""
        KEY = "a long secure secret that is sufficiently random"
        os.chdir(tmp_path)
        with open('jwt_secret.txt', 'w') as secret_file:
            secret_file.write(KEY)
        app = main.create_app('sqlite://', debug=False, testing=True)
        assert app.config['JWT_SECRET_KEY'] == KEY


class TestLogin(object):
    """Tests logging in with an email and password"""

    def test_login(self, client: testing.FlaskClient):
        """Tests that we can login with email+password, and that the JWT returned is valid."""
        with client.application.app_context():
            member = model_fixtures.MemberFactory()  # create a example member to login with
            models.db.session.commit()
            payload = {
                'email': member.email,
                'password': model_fixtures.MEMBER_PASSWORD
            }
            r: wrappers.Response = client.post(url_for('login_page.login'), json=payload)
            assert r.status_code == 200
            assert auth.verify_token(r.json['access_token']) == member

    def test_invalid_email(self, client: testing.FlaskClient):
        """Tests that we reject invalid emails"""
        with client.application.app_context():
            member = model_fixtures.MemberFactory()  # create a example member to not login with
            models.db.session.commit()
        payload = {
            'email': 'qlubbmastare@qmisk.se',
            'password': model_fixtures.MEMBER_PASSWORD
        }
        r: wrappers.Response = client.post(url_for('login_page.login'), json=payload)
        assert r.status_code == 403
        assert r.json['msg'] == 'No user found with the email "qlubbmastare@qmisk.se".'

    def test_invalid_password(self, client: testing.FlaskClient):
        """Tests that we reject invalid passwords"""
        with client.application.app_context():
            member = model_fixtures.MemberFactory()  # create a example member to login with
            models.db.session.commit()
            payload = {
                'email': member.email,
                'password': 'password?'
            }
        r: wrappers.Response = client.post(url_for('login_page.login'), json=payload)
        assert r.status_code == 403
        assert r.json['msg'] == 'Invalid password.'

