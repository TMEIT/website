from sqlalchemy import Column, Date, DateTime
from sqlalchemy.sql.functions import func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from ...database import Base

#TODO: Add functionality to remove records older than 24h

class PWReset(Base):
    """
    Table for storing users that have received a password change request"
    Each entry is contains a UUID. If this UUID is provided in the API a password can be changed.
    """
    __tablename___="pw_reset"
    
    # Key which is shared in email
    reset_key = Column(UUID, primary_key=True, index=True)
    # The user which this reset record is connected to
    user_id = relationship("Member")

    # Not sure how to implement expiration (or if it necessary).
    # The best might be to only allow one reset entry per user, and that it is invalid if it is over 24h old.
    # Then you would have to remove the entry for the user each time a new reset is requested, and check the creation date when performing the reset
    time_created = Column(DateTime(timezone=True), server_default=func.now())