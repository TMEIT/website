import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, SecretStr, constr, EmailStr, validator

from ._check_password import is_password_strong


class SignUpBase(BaseModel):
    login_email: EmailStr
    first_name: constr(min_length=1)
    last_name: constr(min_length=1)
    phone: Optional[str]


class SignUp(SignUpBase):
    uuid: UUID
    time_created: datetime.datetime


class SignUpForm(SignUpBase):
    password: SecretStr

    @validator('password')
    def check_password(cls, v):
        is_password_strong(v)
