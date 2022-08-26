from fastapi import Depends, status, HTTPException, APIRouter
from fastapi.responses import JSONResponse

from sqlalchemy.ext.asyncio import AsyncSession

from ._database_deps import get_db, get_current_user
from ..crud.members import get_members, get_member_by_short_uuid, create_member
from ..schemas.members.schemas import base64url_length_8, MemberMemberView, MemberSelfView, MemberPublicView, \
    MemberMasterView, MemberMasterCreate


router = APIRouter()


@router.get("/")  # TODO: investigate FastAPI's builtin output validation
async def read_members(db: AsyncSession = Depends(get_db),
                       current_user: MemberSelfView = Depends(get_current_user)):

    # Check authentication level and set response level accordingly
    response_schema = MemberPublicView
    if current_user is not None:
        response_schema = MemberMemberView
        if current_user.current_role == "master":
            response_schema = MemberMasterView

    return await get_members(db=db, response_schema=response_schema)


@router.get("/{short_uuid}")  # TODO: investigate FastAPI's builtin output validation
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


@router.post("/create")  # TODO: investigate FastAPI's builtin output validation
async def create_new_member(member_data: MemberMasterCreate,
                        db: AsyncSession = Depends(get_db),
                        current_user: MemberSelfView = Depends(get_current_user)):

    # Make sure user is authenticated with Master permissions
    if current_user.current_role != "master":
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN,
                            content={"error": f"Only masters may create new members."})
    member = await create_member(db=db, data=member_data)
    return member
