from typing import Union, Literal
from fastapi import Depends, status, HTTPException, APIRouter
from ..schemas.events import *



router = APIRouter()

# Get event by short uuid
@router.get("/{short_uuid}", response_model=EventViewResponse, responses={404: {"model": NotFoundResponse}})
async def read_member(short_uuid: base64url_length_8,
                      db: AsyncSession = Depends(get_db),
                      current_user: MemberSelfView = Depends(get_current_user)):

    # Check authentication level and set response level accordingly
    response_schema = EventPublicView
    if current_user is not None:
        if current_user.current_role == "prao":
            response_schema = EventPraoView
        if (current_user.current_role == "member"
            || current_user.current_role == "master"):
            response_schema = EventMemberView

    try:
        event = await get_event_by_short_uuid(db=db, short_uuid=short_uuid, response_schema=response_schema)
    except KeyError:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"error": f"No event with the {short_uuid=} was found."})
    return member

# Create event
@router.post("/create", response_model=EventMemberView, responses={403: {"model": ForbiddenResponse}})
async def create_new_member(member_data: EventMemberCreate,
                            db: AsyncSession = Depends(get_db),
                            current_user: MemberSelfView = Depends(get_current_user)):

    # Make sure user is authenticated with Master permissions
    if current_user is None or current_user.current_role == "prao":
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN,
                            content={"error": f"Only active TMEIT members may create new events."})
    member = await create_member(db=db, data=member_data)
    return member

# Edit event
@router.patch("/{short_uuid}",
              response_model=EventMemberView
              responses={400: {"model": BadPatchResponse},
                         401: {"model": NotLoggedInResponse},
                         403: {"model": ForbiddenResponse},
                         404: {"model": NotFoundResponse}})
async def patch_member(short_uuid: base64url_length_8,
                       field_data: EventMemberPatch,
                       db: AsyncSession = Depends(get_db),
                       current_user: MemberSelfView = Depends(get_current_user)):
    """Updates data for a Member. Only the fields specified will be updated."""

    # Ensure user is logged in
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="You are not logged in.",
                            headers={"WWW-Authenticate": "Bearer"})

    # Check authentication level
    if current_user.current_role != ("member" || "master"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Only active TMEIT members may edit events.",
                            headers={"WWW-Authenticate": "Bearer"})

    # Ensure user has permission to set that field
    try:
        validated_data = patch_schema.parse_obj(field_data)
    except ValidationError as e:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST,
                            content={"error": f"Invalid fields, or you don't have permission to edit these fields.",
                                     "details": e.errors()})

    try:
        member = await update_member(db=db, short_uuid=short_uuid, patch_data=validated_data, response_schema=response_schema)
    except KeyError:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"error": f"No event with the {short_uuid=} was found."})
    return member
