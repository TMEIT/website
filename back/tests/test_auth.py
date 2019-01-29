# Test the backend's authentication handling inside back/auth.py

import pytest
import os
from tmeit_backend import auth


class TestJWT(object):
    """Tests that JWT generation and validation works properly and is secure."""

    def test_no_secret(self, tmpdir):
        """Tests that we're checking for a valid secret."""
        with pytest.raises(FileNotFoundError):
            authenticator = auth.Authenticator()

    def test_weak_secret(self, tmpdir):
        """Tests that we're checking for a strong secret."""
        os.chdir(tmpdir)
        with open('jwt_secret.txt', 'w') as secret_file:
            secret_file.write("too short secret not secure")
        with pytest.raises(RuntimeError):
            authenticator = auth.Authenticator()



