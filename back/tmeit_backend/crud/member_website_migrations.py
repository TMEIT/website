from uuid import UUID, uuid4

from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from .members import get_member
from .. import models
from ..auth import ph
from ..models import Member
from ..schemas.member_website_migrations import Migration, MasterMigrationView, MigrateForm
from ..schemas.members.schemas import MemberSelfView


async def get_migrating_member_with_token(db: AsyncSession, uuid: UUID, security_token: str) -> Migration:
    stmt = select(models.MemberWebsiteMigration)\
        .where(models.MemberWebsiteMigration.uuid == str(uuid))\
        .where(models.MemberWebsiteMigration.security_token == security_token)
    result = (await db.execute(stmt)).fetchone()
    if result is None:
        raise KeyError()
    sql_mwm = dict(result.MemberWebsiteMigration.__dict__)
    return Migration.parse_obj(sql_mwm)


async def get_migrating_member_as_master(db: AsyncSession, uuid: UUID) -> MasterMigrationView:
    stmt = select(models.MemberWebsiteMigration)\
        .where(models.MemberWebsiteMigration.uuid == str(uuid))
    result = (await db.execute(stmt)).fetchone()
    if result is None:
        raise KeyError()
    sql_mwm = dict(result.MemberWebsiteMigration.__dict__)
    return MasterMigrationView.parse_obj(sql_mwm)


async def get_migrating_members(db: AsyncSession, skip: int = 0, limit: int = 100) -> list[MasterMigrationView]:
    stmt = select(models.MemberWebsiteMigration).offset(skip).limit(limit)
    result = await db.execute(stmt)
    sql_mwms = [dict(e.__dict__) for e in result.scalars().all()]
    return [MasterMigrationView.parse_obj(sql_mwm) for sql_mwm in sql_mwms]


async def migrate_member(db: AsyncSession,
                         data: MigrateForm) -> Member:
    async with db.begin():
        # Get migrated data and validate security token
        member_website_migration = await get_migrating_member_with_token(db=db,
                                                                         uuid=data.uuid,
                                                                         security_token=data.security_token)

        # Hash password
        hashed_password = ph.hash(data.password)

        # Create new member
        uuid = uuid4()
        db.add_all([
            Member(uuid=str(uuid),
                   hashed_password=hashed_password,

                   # Remember old username
                   old_username=member_website_migration.old_username,

                   # Use email and phone number from MigrateForm
                   login_email=data.login_email,
                   phone=data.phone,

                   # Import data from old site
                   current_role=member_website_migration.current_role,
                   first_name=member_website_migration.first_name,
                   nickname=member_website_migration.nickname,
                   last_name=member_website_migration.last_name,
                   drivers_license=member_website_migration.drivers_license,
                   stad=member_website_migration.stad,
                   fest=member_website_migration.fest,
                   liquor_permit=member_website_migration.liquor_permit),
        ])

        # Update MWM to say migrated
        await db.execute(update(models.MemberWebsiteMigration)
                         .where(models.MemberWebsiteMigration.uuid == data.uuid)
                         .values(migrated=True))

    return await get_member(db=db, uuid=uuid, response_schema=MemberSelfView)
