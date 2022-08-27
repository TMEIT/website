import datetime
import os
import traceback

from fastapi import FastAPI, Depends, status, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer

from pydantic import BaseModel

from sqlalchemy.ext.asyncio import AsyncSession

from .schemas.members.schemas import base64url_length_8, MemberMemberView, MemberSelfView, MemberPublicView, \
    MemberMasterView, MemberMasterCreate

from . import deps, auth, database
from .auth import JwtAuthenticator, ACCESS_TOKEN_EXPIRE_DAYS
from .crud.members import get_members, get_member_by_short_uuid, get_password_hash, create_member

# Our FastAPI sub-app for the v1 API
app = FastAPI()

# Create SQLAlchemy engine and db connection pool to be shared across requests.
# Requires that POSTGRES_PASSWORD envvar is set.
db_url = database.get_production_url()
engine = database.get_async_engine(db_url)
async_session = database.get_async_session(engine)

jwt_authenticator = JwtAuthenticator(secret_key=os.environ['JWT_KEY'])

get_db = deps.DatabaseDependency(async_session=async_session)
get_current_user = deps.CurrentUserDependency(async_session=async_session,
                                              jwt_authenticator=jwt_authenticator)


@app.get("/members/")  # TODO: investigate FastAPI's builtin output validation
async def read_members(db: AsyncSession = Depends(get_db),
                       current_user: MemberSelfView = Depends(get_current_user)):

    # Check authentication level and set response level accordingly
    response_schema = MemberPublicView
    if current_user is not None:
        response_schema = MemberMemberView
        if current_user.current_role == "master":
            response_schema = MemberMasterView

    return await get_members(db=db, response_schema=response_schema)


@app.get("/members/{short_uuid}")  # TODO: investigate FastAPI's builtin output validation
async def read_member(short_uuid: base64url_length_8,
                      db: AsyncSession = Depends(get_db),
                      current_user: MemberSelfView = Depends(get_current_user)):

    # Check authentication level and set response level accordingly
    response_schema = MemberPublicView
    if current_user is not None:
        response_schema = MemberMemberView
        if current_user.short_uuid == short_uuid:
            response_schema = MemberSelfView
        if current_user.current_role == "master":
            response_schema = MemberMasterView

    try:
        member = await get_member_by_short_uuid(db=db, short_uuid=short_uuid, response_schema=response_schema)
    except KeyError:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"error": f"No member with the {short_uuid=} was found."})
    return member


@app.post("/members/create")  # TODO: investigate FastAPI's builtin output validation
async def create_new_member(member_data: MemberMasterCreate,
                        db: AsyncSession = Depends(get_db),
                        current_user: MemberSelfView = Depends(get_current_user)):

    # Make sure user is authenticated with Master permissions
    if current_user.current_role != "master":
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN,
                            content={"error": f"Only masters may create new members."})
    member = await create_member(db=db, data=member_data)
    return member


class Token(BaseModel):
    access_token: str
    token_type: str


@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(),
                                 db: AsyncSession = Depends(get_db)):
    try:
        member = await get_password_hash(db=db, login_email=form_data.username)
        auth.verify_password(pw=form_data.password, pw_hash=member.hashed_password)
    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Incorrect username or password",
                            headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = datetime.timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    access_token = jwt_authenticator.create_member_access_token(login_email=member.login_email,
                                                                expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}
