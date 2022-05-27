import os
from typing import Callable

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, AsyncEngine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


Base = declarative_base()


def get_production_url() -> str:
    """Gets the postgres url used for production. Requires that the POSTGRES_PASSWORD envvar is set."""
    postgres_user = "tmeit_backend"
    postgres_password = os.environ['POSTGRES_PASSWORD']
    postgres_hostname = "tmeit-db"
    portgres = "5432"
    postgres_db_name = "tmeit_backend"

    sqlalchemy_database_url = (f"postgresql+asyncpg://{postgres_user}:{postgres_password}@"
                               f"{postgres_hostname}:{portgres}/{postgres_db_name}")
    return sqlalchemy_database_url


def get_async_engine(sqlalchemy_database_url: str, echo: bool = False) -> AsyncEngine:
    """Creates SQLAlchemy engine."""
    engine = create_async_engine(sqlalchemy_database_url, echo=echo, future=True)
    return engine


def get_async_session(engine: AsyncEngine) -> Callable[[], AsyncSession]:
    """Creates a sessionmaker for a given async engine."""
    async_session = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession,
                                 expire_on_commit=False)
    return async_session