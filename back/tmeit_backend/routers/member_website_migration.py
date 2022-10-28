import traceback
from uuid import UUID

from fastapi import Depends, status, APIRouter
from fastapi.responses import JSONResponse

from sqlalchemy.ext.asyncio import AsyncSession

from ._database_deps import get_db, get_current_user
from ._error_responses import NotFoundResponse, ForbiddenResponse
from ..crud.member_website_migrations import get_migrating_members, get_migrating_member_with_token, \
    get_migrating_member_as_master, migrate_member

from ..schemas.member_website_migrations import MasterMigrationView, Migration, MigrateForm
from ..schemas.members.schemas import MemberSelfView

router = APIRouter()


@router.get("/members/{uuid}", response_model=Migration, responses={404: {"model": NotFoundResponse}})
async def read_migration(uuid: UUID,
                         token: str,
                         db: AsyncSession = Depends(get_db)):
    """View a pending member migration from the old website (Requires a query string with the security token)"""

    try:
        migration = await get_migrating_member_with_token(db=db, uuid=uuid, security_token=token)
    except KeyError:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"error": f"No member_website_migration with the {uuid=} was found."})
    return migration


@router.get("/members/{uuid}/admin", response_model=MasterMigrationView, responses={403: {"model": ForbiddenResponse},
                                                                              404: {"model": NotFoundResponse}})
async def read_migration_as_master(uuid: UUID,
                                   db: AsyncSession = Depends(get_db),
                                   current_user: MemberSelfView = Depends(get_current_user)):
    """View a pending member migration from the old website without a security token (Masters only)"""

    if current_user is None or current_user.current_role != "master":
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN,
                            content={"error": f"Only masters can see pending member migrations."})

    try:
        migration = await get_migrating_member_as_master(db=db, uuid=uuid)
    except KeyError:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"error": f"No member_website_migration with the {uuid=} was found."})
    return migration


@router.get("/members/", response_model=list[MasterMigrationView],  responses={403: {"model": ForbiddenResponse}})
async def read_migrating_members(db: AsyncSession = Depends(get_db),
                                 current_user: MemberSelfView = Depends(get_current_user)):
    """Lists all migrating members (Masters only)"""

    if current_user is None or current_user.current_role != "master":
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN,
                            content={"error": f"Only masters can see pending member migrations."})

    return await get_migrating_members(db=db)


@router.post("/members/{uuid}/migrate", response_model=MemberSelfView, responses={404: {"model": NotFoundResponse}})
async def perform_member_migration(migrate_form_data: MigrateForm,
                                   db: AsyncSession = Depends(get_db)):
    """Perform migration and create a Member"""

    try:
        member = await migrate_member(db=db, data=migrate_form_data)
    except KeyError:
        traceback.print_exc()  # Help with debugging if issues happen in production
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"error": f"No member_website_migration with the uuid={migrate_form_data.uuid} was found."})
    return member

# TODO: Send email for member website migration (Masters only)
