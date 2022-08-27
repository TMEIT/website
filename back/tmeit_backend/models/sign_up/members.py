from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql.functions import func

from ...database import Base


class SignUp(Base):
    """
    SQL Alchemy model for Prao sign-ups.

    When new prao sign up, their sign-up submissions are stored with this model,
    and then a master can accept their sign up and accept them as a new TMEIT prao.
    """
    __tablename__ = "sign_ups"

    # Primary key, in a UUID format(128-bit)
    uuid = Column(UUID, primary_key=True, index=True)

    # Created/Updated timestamps
    time_created = Column(DateTime(timezone=True), server_default=func.now())

    # Email, will be used to log in when converted to full member
    login_email = Column(String, nullable=False, unique=True, index=True)

    # Future password, hashed with argon2
    hashed_password = Column(String, nullable=False)

    first_name = Column(String, nullable=False)

    last_name = Column(String, nullable=False)

    # Phone number. Optional.
    phone = Column(String)
