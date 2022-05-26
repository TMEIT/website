import os

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

POSTGRES_USER = "tmeit_backend"
POSTGRES_PASSWORD = os.environ['POSTGRES_PASSWORD']
POSTGRES_HOSTNAME = "tmeit-db"
PORTGRES = "5432"
POSTGRES_DB_NAME = "tmeit_backend"

SQLALCHEMY_DATABASE_URL = (f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@"
                           f"{POSTGRES_HOSTNAME}:{PORTGRES}/{POSTGRES_DB_NAME}")

engine = create_async_engine(SQLALCHEMY_DATABASE_URL)
async_session = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()
