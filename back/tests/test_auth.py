# Test the backend's authentication handling inside back/auth.py

import pytest
import os
import datetime
import jwt
from tmeit_backend import auth


class TestSecret:
    """Tests that secrets are being used and their security is verified."""

    def test_no_secret(self, tmp_path):
        """Tests that we're checking for a valid secret."""
        os.chdir(tmp_path)
        with pytest.raises(FileNotFoundError):
            authenticator = auth.Authenticator()

    def test_weak_secret(self, tmp_path):
        """Tests that we're checking for a strong secret."""
        os.chdir(tmp_path)
        with open('jwt_secret.txt', 'w') as secret_file:
            secret_file.write("too short secret not secure")
        with pytest.raises(RuntimeError):
            authenticator = auth.Authenticator()



