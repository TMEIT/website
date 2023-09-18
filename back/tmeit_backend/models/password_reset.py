from sqlalchemy import Column, Date, DateTime
from sqlalchemy.sql.functions import func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from ..database import Base


class PasswordReset(Base):
    """
    Table for storing UUIDs that have received a password change request.
    When a reset is requested a "reset key" is sent to the email address of the user.
    It is also stored here together with the users UUID.
    If the reset password endpoint is accessed this table is checked to ensure that the link is valid and to which user it pertains.
    """
    __tablename__ = "password_reset"
    # Key which is shared in email
    hashed_reset_token = Column(UUID, primary_key=True, index=True)
    # The user which this reset record is connected to
    user_id = Column(UUID)
    time_created = Column(DateTime(timezone=True), server_default=func.now())
