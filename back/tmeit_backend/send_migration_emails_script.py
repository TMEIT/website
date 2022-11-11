import asyncio

from arq import create_pool
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from . import models
from .schemas.member_website_migrations import MasterMigrationView
from .database import get_async_session, get_async_engine, get_production_url
from .redis import redis_settings


async def get_migrating_members(db: AsyncSession, skip: int = 0, limit: int = 1000) -> list[MasterMigrationView]:
    stmt = select(models.MemberWebsiteMigration).offset(skip).limit(limit)
    result = await db.execute(stmt)
    sql_mwms = [dict(e.__dict__) for e in result.scalars().all()]
    return [MasterMigrationView.parse_obj(sql_mwm) for sql_mwm in sql_mwms]

async def main():
    # connect to arq
    worker_pool = await create_pool(redis_settings)

    # Connect to db
    db_url = get_production_url()
    engine = get_async_engine(db_url, echo=True)

    # Get all mwms
    async with get_async_session(engine)() as db:
        mwms = await get_migrating_members(db=db)

    # reverse list so we send emails to newest accounts first (migrations were imported in id order from old db)
    mwms.reverse()

    for mwm in mwms:
        print(f"Sending email to {mwm.login_email}")
        await worker_pool.enqueue_job('send_website_migration_email', str(mwm.uuid))
        await asyncio.sleep(1)  # Rate-limit emails to 1 per second so email providers dont get mad

if __name__ == '__main__':
    asyncio.run(main())
