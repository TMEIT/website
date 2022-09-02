import datetime
import os
import traceback
from typing import Literal

from fastapi import Depends, status, HTTPException, APIRouter
from fastapi.security import OAuth2PasswordRequestForm

from pydantic import BaseModel

from sqlalchemy.ext.asyncio import AsyncSession

from .. import auth
from ..auth import ACCESS_TOKEN_EXPIRE_DAYS, JwtAuthenticator
from ..crud.members import get_password_hash
from ._database_deps import get_db


# Load JWT secret key from envvar
jwt_authenticator = JwtAuthenticator(secret_key=os.environ['JWT_KEY'])


router = APIRouter()


class Token(BaseModel):
    access_token: str
    token_type: str


class InvalidLoginResponse(BaseModel):
    detail: Literal["Incorrect email or password"]


@router.post("/token", response_model=Token, responses={401: {"model": InvalidLoginResponse}})
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(),
                                 db: AsyncSession = Depends(get_db)):
    try:
        member = await get_password_hash(db=db, login_email=form_data.username)
        auth.verify_password(pw=form_data.password, pw_hash=member.hashed_password)
    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Incorrect email or password",
                            headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = datetime.timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    access_token = jwt_authenticator.create_member_access_token(login_email=member.login_email,
                                                                expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}