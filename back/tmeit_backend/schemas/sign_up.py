import datetime
import ipaddress
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, SecretStr, constr, EmailStr, validator

from ._check_password import is_password_strong


class SignUpBase(BaseModel):
    """Editable fields for SignUps. Mostly used as a baseclass."""
    login_email: EmailStr
    first_name: constr(min_length=1)
    last_name: constr(min_length=1)
    phone: Optional[str]


class SignUp(SignUpBase):
    """Visible fields on the SignUp database model"""
    uuid: UUID
    time_created: datetime.datetime
    ip_address: ipaddress.IPv6Address


class SignUpForm(SignUpBase):
    """Fields that prao fills in to sign up, including setting a password."""
    password: str

    @validator('password')
    def check_password(cls, v):
        return is_password_strong(v)

