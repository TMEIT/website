from sqlalchemy import Column, String, Boolean, Index, Computed, Date, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.orm import column_property
from sqlalchemy.sql.expression import ColumnClause, cast, text
from sqlalchemy.sql.functions import FunctionElement, func

from ...database import Base
from ..utils import short_uuid_from_uuid


class Member(Base):
    """
    SQL Alchemy model for TMEIT Members.

    TMEIT members are stored in the database by their email address. (Usually a KTH email, but this may be a Gmail
    address if they are not a KTH student)
    Members have a current role, which describes their current position in TMEIT and their website permissions.
    They can also can have a number of different roles and titles in the klubbmästeri.
    Members can belong to many different workteams but should only be in one active workteam. Members can be given a
    nickname that they have earned, or have chosen themselves. We keep track of a member's phone number, what
    qualifications they have, and whether they are on the Kistan liquor license.
    Members can also be granted titles that represent roles that they have or special things that they have done, and
    the year that they held the role can also be recorded.
    Members may also be team leaders for the workteams they are a part of.
    """
    __tablename__ = "members"

    # Primary key, in a UUID format(128-bit)
    uuid = Column(UUID, primary_key=True, index=True)

    # Computed column/index with the first 48 bits of the UUID in the base64url format,
    # used to look up the member with a given URL.
    # There's less than a 1 in 1 trillion chance of collision with 1000 members,
    # so it's totally fine to reduce UUID keyspace like this.
    # It has a uniqueness check, just in case a collision happens.
    short_uuid = Column(String, Computed(short_uuid_from_uuid(uuid)), unique=True, index=True)

    # Created/Updated timestamps
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    # Email, used to log in.
    login_email = Column(String, nullable=False, unique=True, index=True)

    # current_role: What role the member currently has in TMEIT. Defines the member's permissions on the TMEIT
    #             website. Stored as a string that corresponds to a value in CurrentRoleEnum.
    current_role = Column(String, nullable=False)

    # Password hashed with argon2
    hashed_password = Column(String)

    first_name = Column(String, nullable=False)

    # Nickname/Ovvenamn, if they have one
    nickname = Column(String)

    last_name = Column(String, nullable=False)

    # Phone number.
    # No particular format, this will just be shown on profile, or maybe passed to a phone dialer on mobile.
    phone = Column(String)

    # Whether the member has a driver's license in Sweden/EU, if we know.
    drivers_license = Column(Boolean)

    # When the member received STAD training, null if they don't have STAD.
    stad = Column(Date)

    # When the member received FEST training, null if they don't have STAD.
    fest = Column(Date)

    # When the member was added to our liquor permit.
    liquor_permit = Column(Date)

    # Relationships
    # role_histories = relationship('RoleHistory', back_populates='owner')
    # workteams = relationship('Workteam', secondary=workteammember_table, back_populates="members")
    # workteams_leading = relationship('Workteam', secondary=workteamleader_table, back_populates="team_leaders")
    #
    # # Extra columns/constraints/indexes that must be declared with "Imperative mapping"
    # __table_args__ = (
    #
    #     # "short_uuid", functional index with the first 48 bits of the UUID in the base64url format.
    #     # Used to represent the member in a URL.
    #     Index("idx_short_uuid", short_uuid_from_uuid(uuid), unique=True),
    # )
