from sqlalchemy import Column, String, Computed, Date, DateTime, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.sql.functions import func

from typing import TYPE_CHECKING, List

from ._utils import short_uuid_from_uuid # reusing the functionality from the members module
from ..database import Base
from .members.members import Member

"""
Table for creating a many-to-many relationship between useres and events
"""
#attending = Table(
#    "attending",
#    Base.metadata,
#    Column("event", ForeignKey("events.uuid"), primary_key=True),
#    Column("users", ForeignKey("members.uuid"), primary_key=True),
#    )
    

class Event(Base):
    """
    SQL Alchemy model for events.
    Every event has a unique ID as well as several data fields.
    Currently events can be updated by every TMEIT member.
    """

    # Table containing event records
    __tablename__ = "events"

    # Primary key, 128 bit ID
    uuid = Column(UUID, primary_key=True, index=True)

    # Computed column/index with the first 48 bits of the UUID in the base64url format,
    # used to look up the member with a given URL.
    # There's less than a 1 in 1 trillion chance of collision with 1000 events,
    # so it's totally fine to reduce UUID keyspace like this.
    # It has a uniqueness check, just in case a collision happens.
    short_uuid = Column(String, Computed(short_uuid_from_uuid(uuid)), unique=True, index=True)

    event_owner = Column(String, nullable=False)
    # Created/Updated timestamps
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    event_time = Column(DateTime(timezone=True), nullable=False)
    event_endtime = Column(DateTime(timezone=True))

    # sign_up_end_time = Column(DateTime(timezone=True), nullable=False)

    title = Column(String, nullable=False)
    description = Column(String, nullable=False)

    location = Column(String, nullable=False)

    visibility = Column(String, nullable=False) # Who can see the event. (Public, prao or marsalk + masters + vrak)
    # Following line should be line below in declarative form, not sure how to achieve that
    # children: Mapped[List[Child]] = relationship(secondary=association_table)
#   attending = relationship("Member", secondary=attending)
    
