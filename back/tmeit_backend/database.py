import os
from typing import Callable

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


Base = declarative_base()


def get_async_session() -> Callable[[], AsyncSession]:
    """
    Creates SQLAlchemy engine and returns a sessionmaker for it.

    Requires that POSTGRES_PASSWORD envvar is set.
    """
    postgres_user = "tmeit_backend"
    postgres_password = os.environ['POSTGRES_PASSWORD']
    postgres_hostname = "tmeit-db"
    portgres = "5432"
    postgres_db_name = "tmeit_backend"

    sqlalchemy_database_url = (f"postgresql+asyncpg://{postgres_user}:{postgres_password}@"
                               f"{postgres_hostname}:{portgres}/{postgres_db_name}")

    engine = create_async_engine(sqlalchemy_database_url)
    async_session = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession, expire_on_commit=False)
    return async_session
