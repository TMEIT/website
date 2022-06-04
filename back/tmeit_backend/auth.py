import datetime
from dataclasses import dataclass

import argon2

from jose import jwt, JWTError

# Init argon2 hasher
# Takes 150ms of cpu and 64MiB of memory to verify a password on a Zen 3 core @ 4.5Ghz.
ph = argon2.PasswordHasher(time_cost=3, memory_cost=65536, parallelism=1, hash_len=128, salt_len=16)


def verify_password(pw: str, pw_hash: str) -> None:
    """ Verify that the password matches the hash, raises argon2.exceptions.VerificationError if it doesn't."""
    ph.verify(password=pw, hash=pw_hash)


ACCESS_TOKEN_EXPIRE_DAYS = 180


class JwtAuthenticator:
    """
    Class for generating and verifying JWTs

    initialized with the hexadecimal secret key used to sign/verify the JWTs
    """

    def __init__(self, secret_key: str):

        self.SECRET_KEY = secret_key
        self.ALGORITHM = "HS256"

    def create_member_access_token(self, login_email: str, expires_delta: datetime.timedelta) -> str:
        expire = datetime.datetime.utcnow() + expires_delta
        claims = {"sub": f"email:{login_email}",
                  "exp": expire}
        encoded_jwt = jwt.encode(claims=claims,
                                 key=self.SECRET_KEY,
                                 algorithm=self.ALGORITHM)
        return encoded_jwt

    def verify_jwt(self, token) -> str:
        """
        Verifies JWT and returns the login_email it identifies.

        Raises a subclass of JWTError if the JWT is invalid.
        """

        payload: dict[str, str] = jwt.decode(token=token,
                                             key=self.SECRET_KEY,
                                             algorithms=[self.ALGORITHM])
        email: str = payload.get("sub").removeprefix("email:")
        if email is None:
            raise JWTError
        return email
