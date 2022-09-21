import ipaddress
from typing import Union, Literal
from uuid import UUID

from fastapi import Depends, status, HTTPException, APIRouter, Request
from fastapi.responses import JSONResponse

from sqlalchemy.ext.asyncio import AsyncSession

from ._database_deps import get_db, get_current_user
from ._error_responses import NotFoundResponse, ForbiddenResponse
from ..crud.sign_up import get_sign_up, get_sign_ups
from ..crud.sign_up import sign_up as sign_up_crud
from ..schemas.members.schemas import base64url_length_8, MemberMemberView, MemberSelfView, MemberPublicView, \
    MemberMasterView, MemberMasterCreate, MemberViewResponse
from ..schemas.sign_up import SignUp, SignUpForm


router = APIRouter()


class SignupsMastersOnlyResponse(ForbiddenResponse):
    error: Literal["Only masters may see pending sign-ups."]


@router.get("/", response_model=list[SignUp], responses={403: {"model": SignupsMastersOnlyResponse}})
async def read_sign_ups(db: AsyncSession = Depends(get_db),
                        current_user: MemberSelfView = Depends(get_current_user)):

    if current_user is None or current_user.current_role != "master":
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN,
                            content={"error": f"Only masters may see the list of pending sign-ups."})

    return await get_sign_ups(db=db)


@router.get("/{uuid}", response_model=SignUp, responses={404: {"model": NotFoundResponse}})
async def read_sign_up(uuid: UUID,
                       db: AsyncSession = Depends(get_db)):

    # We allow anyone with the signup UUID to view the signup, so that prao can see their signup status page

    try:
        signup = await get_sign_up(db=db, uuid=uuid)
    except KeyError:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"error": f"No signup with the {uuid=} was found."})
    return signup


@router.delete("/{uuid}", status_code=204, responses={403: {"model": SignupsMastersOnlyResponse},
                                                      404: {"model": NotFoundResponse}})
async def delete_sign_up(uuid: UUID,
                         db: AsyncSession = Depends(get_db),
                         current_user: MemberSelfView = Depends(get_current_user)):
    if current_user is None or current_user.current_role != "master":
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN,
                            content={"error": f"Only masters may delete a pending sign-up."})
    try:
        await delete_sign_up(db=db, uuid=uuid)
    except KeyError:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"error": f"No signup with the {uuid=} was found."})


@router.post("/approve/{uuid}", response_model=MemberMasterView, responses={403: {"model": SignupsMastersOnlyResponse},
                                                                            404: {"model": NotFoundResponse}})
async def approve_sign_up(uuid: UUID,
                          db: AsyncSession = Depends(get_db),
                          current_user: MemberSelfView = Depends(get_current_user)):
    if current_user is None or current_user.current_role != "master":
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN,
                            content={"error": f"Only masters may approve a pending sign-up."})

    try:
        member = await approve_sign_up(db=db, uuid=uuid)
    except KeyError:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"error": f"No signup with the {uuid=} was found."})
    return member


@router.post("/sign_up", response_model=SignUp,)
async def sign_up(sign_up_form: SignUpForm,
                  request: Request,
                  db: AsyncSession = Depends(get_db)):
    signup = await sign_up_crud(db=db, data=sign_up_form, ip_address=ipaddress.ip_address(request.client.host))
    return signup
