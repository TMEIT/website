# Test the backend's authentication handling inside back/auth.py

import pytest
import os


class TestSecret:
    """Tests that secrets are being used and their security is verified."""

    def test_no_secret(self, tmp_path):
        """Tests that we're checking for a valid secret when loading in production"""
        os.environ['FLASK_ENV'] = 'production'
        os.chdir(tmp_path)
        with pytest.raises(FileNotFoundError):
            import tmeit_backend.app

    def test_weak_secret(self, tmp_path):
        """Tests that we're checking for a strong secret when loading in production"""
        os.environ['FLASK_ENV'] = 'production'
        os.chdir(tmp_path)
        with open('jwt_secret.txt', 'w') as secret_file:
            secret_file.write("too short secret not secure")
        with pytest.raises(RuntimeError):
            import tmeit_backend.app



