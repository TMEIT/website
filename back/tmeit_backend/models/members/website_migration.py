from sqlalchemy import Column, String, Boolean, Date, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.sql.functions import func

from typing import TYPE_CHECKING, Optional

from ...database import Base

if TYPE_CHECKING:
    from .members import Member


class MemberWebsiteMigration(Base):
    """
    SQL Alchemy model for Handling the migration of members from the old 2011 tmeit.se to the new 2022 tmeit.se

    Users will receive a link in their email that allows them to see the data they are transferring to the new website
    Confirm their consent of our GDPR policy, and set their email and password.

    This model contains all the data we can import into the new database.
    Any future data we can import from the old database will be imported directly into the member models.

    When we start importing new data like workteams or role histories into the member models,
    we should close the migration forms,
    since anybody who migrates afterwards will be missing data compred to everybody else
    """

    __tablename__ = "member_website_migration"

    # Primary key, in a UUID format(128-bit)
    uuid = Column(UUID, primary_key=True, index=True)

    # Extra token for identifying that the user actually owns the account being transferred
    security_token = Column(String, nullable=False)

    # When the email with the transfer link was sent to the user, null if it hasn't been sent yet
    email_sent = Column(Date)

    # Created/Updated timestamps
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    # Their username in the old db
    old_username = Column(String, nullable=False, unique=True, index=True)

    # Relation to new member if this MWM has been migrated into a new Member object
    new_member: Mapped[Optional["Member"]] = relationship(back_populates="migration_entry")

    migrated: Mapped[bool]  # Whether or not a full Member object has been created from this MWM

    # Email, used to log in. Users can either confirm their email or pick a new email in the transfer form
    # By having the user specify their email in the transfer form,
    # hopefully this will help their password manager save the password automatically
    # Note that we don't set a unique constraint because some users have null emails
    # The email system will get confusing if you import multiple users with the same non-null email, though, so don't do it
    login_email: Mapped[Optional[str]]

    # current_role: What role the member currently has in TMEIT. Defines the member's permissions on the TMEIT
    #             website. Stored as a string that corresponds to a value in CurrentRoleEnum.
    current_role = Column(String, nullable=False)

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
