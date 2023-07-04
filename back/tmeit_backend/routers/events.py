from typing import Union, Literal

from argon2.exceptions import VerificationError
from arq import ArqRedis
from fastapi import Depends, status, HTTPException, APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ValidationError

from sqlalchemy.ext.asyncio import AsyncSession

from ._database_deps import get_db, get_current_user
from ._error_responses import NotFoundResponse, ForbiddenResponse, BadPatchResponse
from ..crud.events import create_event, get_event_by_short_uuid, get_event_by_timespan, update_event
from ..deps import get_worker_pool
from ..schemas.events import base64url_length_8, EventMemberView, EventPraoView, EventPublicView, \
    EventMemberPatch, EventMemberCreate, EventViewResponse

router = APIRouter()

class NotLoggedInResponse(BaseModel):
    detail: Literal["You are not logged in."]


# Get event
@router.get("/{short_event_id}", response_model=list[Union[EventMemberView, EventPraoView, EventPublicView]])
async def read_event(short_event_id: base64url_length_8, db: AsyncSession = Depends(get_db)):
    current_user = get_current_user
    # Check authentication level and set response level accordingly
    response_schema = EventPublicView
    if current_user.current_role == "prao":
        response_schema = EventPraoView
    if current_user.current_role == "marsalk" | current_user.current_role == "master":
        response_schema = EventMemberView

    try:
        member = await get_event_by_short_uuid(db=db, short_event_id=short_event_id, response_schema=response_schema)
    except KeyError:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"error": f"No event with id {short_event_id} was found."})
    return member

# Create event
@router.post("/create", response_model=EventMemberView, responses={403: {"model": ForbiddenResponse}})
async def create_new_event(event_data: EventMemberCreate,
                            db: AsyncSession = Depends(get_db)):
    current_user = get_current_user
    # Make sure user is authenticated with member or master permissions
    if current_user is None or (current_user.current_role != "member" and current_user.current_role != "master"):
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN,
                            content={"error": f"Only active TMEIT members may create new events."})
    member = await create_event(db=db, data=event_data)
    return member


@router.patch("/{short_eventid}",
              response_model=EventMemberView,
              responses={400: {"model": BadPatchResponse},
                         401: {"model": NotLoggedInResponse},
                         403: {"model": ForbiddenResponse},
                         404: {"model": NotFoundResponse}})
async def patch_event(short_event_id: base64url_length_8,
                       field_data: EventMemberPatch,
                       db: AsyncSession = Depends(get_db)):
    """Updates data for a Member. Only the fields specified will be updated."""
    current_user = get_current_user
    # Ensure user is logged in
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="You are not logged in.",
                            headers={"WWW-Authenticate": "Bearer"})

    # Check authentication level
    if ((current_user.current_role != "member") or (current_user.current_role != "master")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Only active TMEIT members may edit events.",
                            headers={"WWW-Authenticate": "Bearer"})
    response_schema = EventMemberView
    patch_schema = EventMemberPatch
    # Ensure user has permission to set that field
    try:
        validated_data = patch_schema.parse_obj(field_data)
    except ValidationError as e:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST,
                            content={"error": f"Invalid fields, or you don't have permission to edit these fields.",
                                     "details": e.errors()})

    try:
        member = await update_event(db=db, short_event_id=short_event_id, patch_data=validated_data, response_schema=response_schema)
    except KeyError:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"error": f"No event with the {short_event_id=} was found."})
    return member
