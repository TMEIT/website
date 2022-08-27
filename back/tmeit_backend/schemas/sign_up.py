import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, SecretStr


class SignUpBase(BaseModel):
    login_email: str
    first_name: str
    last_name: str
    phone: Optional[str]


class SignUp(SignUpBase):
    uuid: UUID
    time_created: datetime.datetime


class SignUpForm(SignUpBase):
    password: SecretStr
