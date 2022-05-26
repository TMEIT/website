from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID

from ...database import Base


class Member(Base):
    __tablename__ = "members"

    guid = Column(UUID, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
