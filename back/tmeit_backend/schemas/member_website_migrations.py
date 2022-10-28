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
    email_sent: datetime.datetime
    login_email: EmailStr
    current_role: CurrentRoleEnum
    first_name: str
    nickname: str
    last_name: str
    phone: str
    drivers_license: bool
    stad: datetime.datetime
    fest: datetime.datetime
    liquor_permit: datetime.datetime


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
