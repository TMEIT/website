from typing import Union, Literal

from argon2.exceptions import VerificationError
from arq import ArqRedis
from fastapi import Depends, status, HTTPException, APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ValidationError

from sqlalchemy.ext.asyncio import AsyncSession

from ._database_deps import get_db, get_current_user
from ._error_responses import NotFoundResponse, ForbiddenResponse, BadPatchResponse
from ..crud.events import create_event, get_event, get_events, remove_event
from ..deps import get_worker_pool
from ..schemas.events import UUID, EventMemberView, EventPraoView, EventPublicView, \
    EventMemberPatch, EventMemberCreate, EventViewResponse, EventMasterDelete

router = APIRouter()

class NotLoggedInResponse(BaseModel):
    detail: Literal["You are not logged in."]

# Get event
@router.get("/{uuid}", response_model=list[Union[EventMemberView, EventPraoView, EventPublicView]])
async def read_event(uuid: UUID, 
                     db: AsyncSession = Depends(get_db),
                     current_user: EventMemberView = Depends(get_current_user)):
    
    # Check authentication level and set response level accordingly
    response_schema = EventPublicView
    if current_user is not None and current_user.current_role == "prao":
        response_schema = EventPraoView
    if current_user is not None and current_user.current_role != "prao": # Add vraq etc here
        response_schema = EventMemberView

    try:
        event = await get_event(db=db, uuid=uuid, response_schema=response_schema)
    except KeyError:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"error": f"No event with id {uuid} was found."})
    return event

@router.get("/", response_model=list[Union[EventMemberView, EventPraoView, EventPublicView]])
async def read_events(db: AsyncSession = Depends(get_db),
                        current_user: EventMemberView = Depends(get_current_user)):

    # Check authentication level and set response level accordingly
    response_schema = EventPublicView
    if current_user is not None and current_user.current_role == "prao":
        response_schema = EventPraoView
    if current_user is not None and current_user.current_role != "prao":
        response_schema = EventMemberView

    try:
        events = await get_events(db=db, response_schema=response_schema)
    except KeyError:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"error": f"No events were found"})
    return events

# Create event
@router.post("/create", response_model=EventMemberCreate, responses={403: {"model": ForbiddenResponse}})
async def create_new_event(event_data: EventMemberCreate,
                            db: AsyncSession = Depends(get_db),
                            current_user: EventMemberView = Depends(get_current_user)):
    
    # Make sure user is authenticated with member or master permissions
    if current_user is None or (current_user.current_role != "marsalk" and current_user.current_role != "master"):
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN,
                            content={"error": f"Only TMEIT marhsals or masters may create new events."})
    event = await create_event(db=db, data=event_data)
    return event

@router.delete("/{uuid}", responses={403: {"model": ForbiddenResponse}})
async def delete_event( uuid: UUID,
                        db: AsyncSession = Depends(get_db),
                        current_user: EventMemberView = Depends(get_current_user)):

    if current_user is None:
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN,
                            content={"error": f"Only masters have the permission to delete events."})
    try: 
        await remove_event(db=db, uuid=uuid)
    except KeyError:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"error": f"No event with the ID {uuid=} was found."})
    return JSONResponse(status_code=status.HTTP_200_OK,
                        content={"Success": f"event with ID {uuid} has been deleted"})