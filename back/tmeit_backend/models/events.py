from sqlalchemy import Column, String, Boolean, Computed, Date, DateTime, ForeignKey, Table, List
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship, DeclarativeBase
from sqlalchemy.sql.functions import func
from sqlalchemy.dialects.postgresql import UUID
from ._utils import short_uuid_from_uuid # reusing the functionality from the members module


from typing import Optional
from typing import TYPE_CHECKING

from ..database import Base
from .members.members import Member

class Event(Base):
    """
    SQL Alchemy model for events.
    Every event has a unique ID as well as several data fields.
    Currently events can be updated by every TMEIT member.
    """

    # Table containing event records
    __tablename__ = "events"

    # Primary key, 128 bit ID
    event_id = Column(UUID, primary_key=True, index=True)

    # Computed column/index with the first 48 bits of the UUID in the base64url format,
    # used to look up the member with a given URL.
    # There's less than a 1 in 1 trillion chance of collision with 1000 events,
    # so it's totally fine to reduce UUID keyspace like this.
    # It has a uniqueness check, just in case a collision happens.
    short_event_id = Column(String, Computed(short_uuid_from_uuid(event_id)), unique=True, index=True)
        # Created/Updated timestamps
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    event_time = Column(DateTime(timezone=True, server_default=func.now()))
    sign_up_end_time = Column(DateTime(timezone=True, server_default=func.now()))

    title = Column(String, nullable=False)
    description = Column(String, nullable=False)

    location = Column(String, nullable=False)

    visibility = Column(String, nullable=False) # Who can see the event. (Public, prao or marsalk + masters + vrak)
    attending: Mapped[List[Member]] = relationship(secondary=attending)

"""
Table for creating a many-to-many relationship between useres and events
"""
attending = Table(
    "attending",
    Base.metadata,
    Column("short_event_id", ForeignKey("short_event_id")),
    Column("short_uuid", ForeignKey("short_uuid"))
    )
    
    
