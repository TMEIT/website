from typing import Union, Literal

from fastapi import Depends, status, HTTPException, APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from sqlalchemy.ext.asyncio import AsyncSession

from ._database_deps import get_db, get_current_user
from ._error_responses import NotFoundResponse, ForbiddenResponse
from ..crud.members import get_members, get_member_by_short_uuid, create_member, update_member
from ..schemas.members.schemas import base64url_length_8, MemberMemberView, MemberSelfView, MemberPublicView, \
    MemberMasterView, MemberMasterCreate, MemberViewResponse, MemberSelfPatch, MemberMasterPatch

router = APIRouter()
me_router = APIRouter()


class NotLoggedInResponse(BaseModel):
    detail: Literal["You are not logged in."]


@router.get("/", response_model=list[Union[MemberMasterView, MemberMemberView, MemberPublicView]])
async def read_members(db: AsyncSession = Depends(get_db),
                       current_user: MemberSelfView = Depends(get_current_user)):

    # Check authentication level and set response level accordingly
    response_schema = MemberPublicView
    if current_user is not None:
        response_schema = MemberMemberView
        if current_user.current_role == "master":
            response_schema = MemberMasterView

    return await get_members(db=db, response_schema=response_schema)


@me_router.get("/me", response_model=MemberSelfView, responses={401: {"model": NotLoggedInResponse}})
async def me(current_user: MemberSelfView = Depends(get_current_user)):
    """Returns the member data for the currently logged in member."""
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="You are not logged in.",
                            headers={"WWW-Authenticate": "Bearer"})
    return current_user


@router.get("/{short_uuid}", response_model=MemberViewResponse, responses={404: {"model": NotFoundResponse}})
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


@router.post("/create", response_model=MemberMasterView, responses={403: {"model": ForbiddenResponse}})
async def create_new_member(member_data: MemberMasterCreate,
                            db: AsyncSession = Depends(get_db),
                            current_user: MemberSelfView = Depends(get_current_user)):

    # Make sure user is authenticated with Master permissions
    if current_user is None or current_user.current_role != "master":
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN,
                            content={"error": f"Only masters may create new members."})
    member = await create_member(db=db, data=member_data)
    return member


@router.patch("/{short_uuid}",
              response_model=MemberMasterView | MemberSelfView,
              responses={401: {"model": NotLoggedInResponse},
                         403: {"model": ForbiddenResponse},
                         404: {"model": NotFoundResponse}})
async def patch_member(short_uuid: base64url_length_8,
                       field_data: MemberMasterPatch,
                       db: AsyncSession = Depends(get_db),
                       current_user: MemberSelfView = Depends(get_current_user)):
    """Updates data for a Member. Only the fields specified will be updated."""

    # Ensure user is logged in
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="You are not logged in.",
                            headers={"WWW-Authenticate": "Bearer"})

    # Check authentication level
    if current_user.current_role == "master":
        response_schema = MemberMasterView
        patch_schema = MemberMasterPatch
    elif current_user.short_uuid == short_uuid:
        response_schema = MemberSelfView
        patch_schema = MemberSelfPatch
    else:
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN,
                            content={"error": f"You don't have permission to edit this user."})

    # Ensure user has permission to set that field
    try:
        validated_data = patch_schema.parse_obj(field_data)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN,
                            content={"error": f"You don't have permission to edit this user."})

    try:
        member = await update_member(db=db, short_uuid=short_uuid, patch_data=validated_data, response_schema=response_schema)
    except KeyError:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"error": f"No member with the {short_uuid=} was found."})
    return member
