import asyncio

from alembic.config import Config
from alembic import command
from sqlalchemy.ext.asyncio import AsyncEngine

from tmeit_backend.database import get_production_url, get_async_engine


async def drop_all(async_engine: AsyncEngine):
    async with engine.begin() as conn:
        await conn.exec_driver_sql("DROP SCHEMA public CASCADE;")
        await conn.exec_driver_sql("CREATE SCHEMA public;")


def build_db(config: Config):
    command.upgrade(config, "head")
    # TODO Mix alembic migrations with dummy data here


if __name__ == '__main__':
    print("Starting create_test_database script")
    alembic_cfg = Config("alembic.ini")
    db_url = get_production_url()
    engine = get_async_engine(db_url, echo=True)
    print("Deleting existing database")
    asyncio.run(drop_all(engine))
    print("Creating new database")
    build_db(alembic_cfg)
