import asyncio
from unittest.mock import Mock, AsyncMock
import datetime

import pytest
from fastapi import HTTPException
from hypothesis import given
from hypothesis.strategies import emails, timedeltas, datetimes

from jose import jwt

from tmeit_backend import auth, deps
from tmeit_backend.auth import JwtAuthenticator


@pytest.fixture(scope="module")
def jwt_authenticator():
    return JwtAuthenticator(secret_key='yeet')


@given(email=emails(),
       life=timedeltas(min_value=datetime.timedelta(seconds=1),
                       max_value=datetime.timedelta(days=3650)))
def test_create_member_access_token(email, life, jwt_authenticator):
    token = jwt_authenticator.create_member_access_token(login_email=email,
                                                         expires_delta=life)
    claims = jwt.decode(token,
                        jwt_authenticator.SECRET_KEY,
                        algorithms=[jwt_authenticator.ALGORITHM])
    assert claims['sub'] == "email:" + email


@pytest.fixture(scope="module")
def fake_db_session():
    fake_db_session = Mock()
    fake_db_session.return_value.__aenter__ = AsyncMock()
    fake_db_session.return_value.__aexit__ = AsyncMock()

    # Dont "handle" any exceptions when exiting out of an "async with:" block.
    # https://docs.python.org/3/reference/datamodel.html?highlight=aexit#object.__exit__
    fake_db_session.return_value.__aexit__.return_value = False

    return fake_db_session


@pytest.mark.asyncio
@given(email=emails(),
       life=timedeltas(min_value=datetime.timedelta(seconds=1),
                       max_value=datetime.timedelta(days=3650)))
async def test_get_current_user(email, life, jwt_authenticator, fake_db_session):
    good_token = jwt_authenticator.create_member_access_token(login_email=email, expires_delta=life)

    fake_oauth_token = AsyncMock()
    fake_oauth_token.return_value = good_token

    fake_crud = AsyncMock()
    fake_crud.return_value = "I am a member"

    get_current_user = deps.CurrentUserDependency(async_session=fake_db_session,
                                                  jwt_authenticator=jwt_authenticator,
                                                  _crud_function=fake_crud)

    # Inject good token over oauth2_scheme dependency call in the CurrentUserDependency __call__() fn
    member = await anext(get_current_user(token=good_token))
    assert member == "I am a member"


@pytest.mark.asyncio
async def test_get_current_user_no_token(jwt_authenticator, fake_db_session):
    fake_crud = AsyncMock()
    fake_crud.return_value = "I am a member"

    get_current_user = deps.CurrentUserDependency(async_session=fake_db_session,
                                                  jwt_authenticator=jwt_authenticator,
                                                  _crud_function=fake_crud)
    member = await anext(get_current_user(token=None))
    assert member is None


@pytest.mark.asyncio
@given(email=emails(),
       life=timedeltas(min_value=datetime.timedelta(seconds=1),
                       max_value=datetime.timedelta(days=3650)))
async def test_get_current_user_user_does_not_exist(email, life, jwt_authenticator, fake_db_session):
    good_token = jwt_authenticator.create_member_access_token(login_email=email, expires_delta=life)

    fake_crud = AsyncMock()
    fake_crud.side_effect = ValueError()  # Pretending that trying to get the user failed

    with pytest.raises(ValueError):
        await fake_crud()

    get_current_user = deps.CurrentUserDependency(async_session=fake_db_session,
                                                  jwt_authenticator=jwt_authenticator,
                                                  _crud_function=fake_crud)

    member = await anext(get_current_user(token=good_token))
    assert member is None


@pytest.mark.asyncio
async def test_get_current_user_expired_token(jwt_authenticator, fake_db_session):
    dead_token = jwt_authenticator.create_member_access_token(login_email="test@test.se",
                                                              expires_delta=datetime.timedelta(microseconds=1))

    await asyncio.sleep(1)  # let token expire

    fake_crud = AsyncMock()
    fake_crud.return_value = "I am a member"

    get_current_user = deps.CurrentUserDependency(async_session=fake_db_session,
                                                  jwt_authenticator=jwt_authenticator,
                                                  _crud_function=fake_crud)
    with pytest.raises(HTTPException):
        await anext(get_current_user(token=dead_token))


@pytest.mark.asyncio
@given(email=emails(),
       exp=datetimes(min_value=datetime.datetime.utcnow(),
                     max_value=datetime.datetime.max))
async def test_get_current_user_invalid_signature(email, exp, jwt_authenticator, fake_db_session):
    forged_claims = {"sub": f"email:{email}",
                     "exp": exp}
    forged_token = jwt.encode(claims=forged_claims, key="00fdead", algorithm=jwt_authenticator.ALGORITHM)

    fake_crud = AsyncMock()
    fake_crud.return_value = "I am a member"

    get_current_user = deps.CurrentUserDependency(async_session=fake_db_session,
                                                  jwt_authenticator=jwt_authenticator,
                                                  _crud_function=fake_crud)
    with pytest.raises(HTTPException):
        await anext(get_current_user(token=forged_token))


@pytest.mark.asyncio
@given(email=emails(),
       exp=datetimes(min_value=datetime.datetime.utcnow(),
                     max_value=datetime.datetime.max))
async def test_get_current_user_invalid_algorithm(email, exp, jwt_authenticator, fake_db_session):
    forged_claims = {"sub": f"email:{email}",
                     "exp": exp}
    forged_token = jwt.encode(claims=forged_claims, key=jwt_authenticator.SECRET_KEY, algorithm="HS512")

    fake_crud = AsyncMock()
    fake_crud.return_value = "I am a member"

    get_current_user = deps.CurrentUserDependency(async_session=fake_db_session,
                                                  jwt_authenticator=jwt_authenticator,
                                                  _crud_function=fake_crud)
    with pytest.raises(HTTPException):
        await anext(get_current_user(token=forged_token))
