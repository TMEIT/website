import asyncio

from alembic.config import Config as AlembicConfig
from alembic import command as alembic_command

from tmeit_backend.database import get_production_url, get_async_engine, get_async_session
from tmeit_backend.testing_data import populate_db


async def drop_all():
    db_url = get_production_url()
    engine = get_async_engine(db_url, echo=True)
    async with engine.begin() as conn:
        await conn.exec_driver_sql("DROP SCHEMA public CASCADE;")
        await conn.exec_driver_sql("CREATE SCHEMA public;")


async def create_entries(engine):
    async with get_async_session(engine)() as db:
        await populate_db.create_members(1000, db)
        await populate_db.create_signups(20, db)


def build_db(config: AlembicConfig):
    alembic_command.upgrade(config, "head")
    db_url = get_production_url()
    engine = get_async_engine(db_url, echo=True)
    asyncio.run(create_entries(engine))


if __name__ == '__main__':
    print("Starting create_test_database script")
    alembic_cfg = AlembicConfig("alembic.ini")
    print("Deleting existing database")
    asyncio.run(drop_all())
    print("Creating new database")
    build_db(alembic_cfg)
