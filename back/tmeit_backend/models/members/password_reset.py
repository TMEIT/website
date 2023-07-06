from sqlalchemy import Column, Date
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from ...database import Base

class PW_reset(Base):
    """
    Table for storing users that have received a password change request"
    Each entry is contains a UUID. If this UUID is provided in the API a password can be changed.
    """
    __tablename___="pw_reset"
    
    # Key which is shared in email
    reset_key = Column(UUID, primary_key=True, index=True)
    # The user which this reset record is connected to
    user_id = relationship("Member")

    time_created = Column(Date) # add so that it defaults to current date
    time_expired = Column(Date) # should default to current_date + 1?