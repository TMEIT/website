import asyncio

from tmeit_backend import models, database


async def create_all_tables():
    engine = database.get_async_engine(
        'postgresql+asyncpg://tmeit_backend:HBXOHEc6TpkquVHKy2zmSeUIEaUFvW@localhost:5432/tmeit_backend',
        echo=True,
    )
    async with engine.begin() as conn:
        await conn.run_sync(
            models.Base.metadata.create_all
        )

if __name__ == '__main__':
    asyncio.run(create_all_tables())
