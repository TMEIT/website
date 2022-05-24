from uuid import UUID

from pydantic import BaseModel, EmailStr, constr

from .enums import CurrentRoleEnum


# 8 character base64url string
base64url_length_8 = constr(min_length=8, max_length=8, regex=r'[A-Za-z0-9\-_]{8}')


class Member(BaseModel):
    guid: UUID
    short_guid: base64url_length_8
    email: EmailStr
    first_name: str
    nickname: str | None
    last_name: str
    phone: str | None
    drivers_license: bool | None
    stad: bool | None
    fest: bool | None
    liquor_permit: bool | None
    current_role: CurrentRoleEnum
    role_histories: list[UUID]
    workteams: list[UUID]
    workteams_leading: list[UUID]
