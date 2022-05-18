from uuid import UUID

from pydantic import BaseModel, EmailStr

from .enums import CurrentRoleEnum


class Member(BaseModel):
    guid: UUID
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
