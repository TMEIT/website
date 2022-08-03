from typing import Generator, Callable

from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.ext.asyncio import AsyncSession


from .schemas.members.schemas import MemberSelfView

from .auth import JwtAuthenticator
from .crud.members import get_member_by_login_email


class DatabaseDependency:
    """
    Parameterized dependency for getting a database session during a request.

    This Dep is written as a parameterized dependency so that we can
    initialize the database connection alongside the app in api_app.py, instead of in this module.
    That way, we can test this module without an active database.

    https://fastapi.tiangolo.com/advanced/advanced-dependencies/
    """
    def __init__(self, async_session: Callable[[], AsyncSession]):
        self.async_session = async_session

    async def __call__(self) -> Generator:
        """DB dependency for FastAPI endpoints. Yields an AsyncSession."""
        async with self.async_session() as db:
            yield db


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token",
                                     # makes the function return None for the token instead of raising an exception
                                     auto_error=False)


class CurrentUserDependency:
    """
    Parameterized dependency for getting the current user of an authorized request.

    Returns None if there was no token given, or the user no longer exists.

    arguments with underscores are overridden with Mocks during unit tests,
    but should be left as their defaults in normal operation.

    https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/#update-the-dependencies
    https://fastapi.tiangolo.com/advanced/advanced-dependencies/
    """
    def __init__(
            self,

            async_session:
            Callable[[], AsyncSession],

            jwt_authenticator:
            JwtAuthenticator,

            _crud_function:
            Callable
            = get_member_by_login_email

    ):
        self.async_session = async_session
        self.jwt_authenticator = jwt_authenticator
        self.oauth2_scheme = oauth2_scheme
        self.get_member_by_login_email = _crud_function

    async def __call__(
            self,

            # Needs to be called through Depends() for "Authorize" button to show in /docs
            token: str = Depends(oauth2_scheme)
    ) -> Generator[MemberSelfView, None, None]:
        # Skip if no token was passed
        if token is None:
            yield None

        else:

            # Parse and verify token
            try:
                email = self.jwt_authenticator.verify_jwt(token=token)
            except Exception:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                    detail="Could not validate credentials",
                                    headers={"WWW-Authenticate": "Bearer"})

            # Get member from db
            try:
                async with self.async_session() as db:
                    member = await self.get_member_by_login_email(db=db, login_email=email, response_schema=MemberSelfView)
                yield member
            except Exception as e:
                yield None
