import asyncio
import os

from sqlalchemy.ext.asyncio import AsyncSession

from .. import deps, database
from ..auth import JwtAuthenticator

from typing import Iterator


# Create SQLAlchemy engine and db connection pool to be shared across requests.
# Requires that POSTGRES_PASSWORD envvar is set.
db_url = database.get_production_url()
engine = database.get_async_engine(db_url)
async_session = database.get_async_session(engine)


async def get_db() -> Iterator[AsyncSession]:
    async with async_session() as db:
        yield db  # There's a weird bug here where fastapi calls this yield after the user triggers a ValidationError. I don't know why.


jwt_authenticator = JwtAuthenticator(secret_key=os.environ['JWT_KEY'])

get_current_user = deps.CurrentUserDependency(async_session=async_session,
                                              jwt_authenticator=jwt_authenticator)
