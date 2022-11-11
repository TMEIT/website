import datetime
from typing import Optional, Literal
from uuid import UUID

from pydantic import BaseModel, EmailStr, validator

from ._check_password import is_password_strong
from .members.enums import CurrentRoleEnum


class Migration(BaseModel):
    """What a user sees when viewing a pending migration"""
    uuid: UUID
    time_created: datetime.datetime
    email_sent: Optional[datetime.datetime]
    old_username: str
    migrated: bool
    login_email: Optional[str]
    current_role: CurrentRoleEnum
    first_name: str
    nickname: Optional[str]
    last_name: str
    phone: Optional[str]
    drivers_license: Optional[bool]
    stad: Optional[datetime.date]
    fest: Optional[datetime.date]
    liquor_permit: Optional[datetime.date]


class MasterMigrationView(Migration):
    """Extra fields that only masters can see"""
    security_token: str


class MigrateForm(BaseModel):
    """Fields that member fills in to finish migration"""
    uuid: UUID
    security_token: str

    login_email: EmailStr

    phone: Optional[str]

    password: str

    gdpr_consent: Literal[True]

    @validator('password')
    def check_password(cls, v):
        return is_password_strong(v)
