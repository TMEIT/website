import datetime

from fastapi.security import OAuth2PasswordBearer

from pydantic import BaseModel

import argon2

from jose import jwt


SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"  # TODO
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 180

# Init argon2 hasher
# Takes 150ms of cpu and 64MiB of memory to verify a password on a Zen 3 core @ 4.5Ghz.
ph = argon2.PasswordHasher(time_cost=3, memory_cost=65536, parallelism=1, hash_len=128, salt_len=16)


def verify_password(pw: str, pw_hash: str) -> None:
    """ Verify that the password matches the hash, raises argon2.exceptions.VerificationError if it doesn't."""
    ph.verify(password=pw, hash=pw_hash)


def create_member_access_token(login_email: str, expires_delta: datetime.timedelta) -> str:
    expire = datetime.datetime.utcnow() + expires_delta
    claims = {"sub": f"email:{login_email}",
              "exp": expire}
    encoded_jwt = jwt.encode(claims=claims,
                             key=SECRET_KEY,
                             algorithm=ALGORITHM)
    return encoded_jwt
