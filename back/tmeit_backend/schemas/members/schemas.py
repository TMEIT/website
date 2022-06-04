import datetime
from typing import TypedDict, Any, Literal, Union, Optional
from uuid import UUID

from pydantic import EmailStr, constr, create_model, Field, BaseModel

from ..access_levels import APIAccessLevelsEnum
from .enums import CurrentRoleEnum


# Pydantic models for member are defined programmatically,
# in order to generate different models for different API permission levels
# (e.g. don't return email in api if user is unauthenticated)


edit = APIAccessLevelsEnum.edit
read = APIAccessLevelsEnum.read
denied = APIAccessLevelsEnum.denied


class FieldDescription(TypedDict):

    # API permission levels
    master: APIAccessLevelsEnum     # API user is a Master/admin
    self: APIAccessLevelsEnum       # Member being accessed is the same as API user
    member: APIAccessLevelsEnum     # API user is a member of TMEIT
    public: APIAccessLevelsEnum     # API user is unauthenticated

    # Field type
    type: Any


member_fields = {

    # Publicly visible fields
    "first_name":       FieldDescription(master=edit,   self=read,  member=read,    public=read,    type=str),
    "nickname":         FieldDescription(master=edit,   self=edit,  member=read,    public=read,    type=Optional[str]),
    "last_name":        FieldDescription(master=edit,   self=read,  member=read,    public=read,    type=str),
    "current_role":     FieldDescription(master=edit,   self=read,  member=read,    public=read,    type=CurrentRoleEnum),

    # Fields that a member can edit themselves, but only visible to TMEIT members
    "login_email":      FieldDescription(master=edit,   self=edit,  member=read,    public=denied,  type=EmailStr),
    "phone":            FieldDescription(master=edit,   self=edit,  member=read,    public=denied,  type=Optional[str]),
    "drivers_license":  FieldDescription(master=edit,   self=edit,  member=read,    public=denied,  type=Optional[bool]),

    # Fields that are only visible to TMEIT members, and can only be edited by a master
    "stad":             FieldDescription(master=edit,   self=read,  member=read,    public=denied,  type=Optional[datetime.date]),
    "fest":             FieldDescription(master=edit,   self=read,  member=read,    public=denied,  type=Optional[datetime.date]),
    "liquor_permit":    FieldDescription(master=edit,   self=read,  member=read,    public=denied,  type=Optional[datetime.date]),

    # Object relations (Read-only from /member/ endpoints)
    "role_histories":   FieldDescription(master=edit,   self=read, member=read,     public=denied, type=list[UUID]),
    "workteams":        FieldDescription(master=edit,   self=read, member=read,     public=denied, type=list[UUID]),
    "workteams_leading":FieldDescription(master=edit,   self=read, member=read,     public=denied, type=list[UUID]),

}


# 8 character base64url string
base64url_length_8 = constr(min_length=8, max_length=8, regex=r'[A-Za-z0-9\-_]{8}')


def build_member_schema_dict(
        permission_role: Literal["master"] | Literal["self"] | Literal["member"] | Literal["public"],
        api_access_level: APIAccessLevelsEnum) -> dict[str, tuple]:

    schema_dict: dict[str, tuple] = {}

    for field, fd in member_fields.items():
        if fd[permission_role] >= api_access_level:
            schema_dict[field] = (fd['type'], Field(...))

    return schema_dict


# Always include uuid and short uuid in api requests/responses
database_fields = {
    "uuid": (UUID, Field(...)),
    "short_uuid": (base64url_length_8, Field(...)),
}

# View models
MemberPublicView = create_model('MemberPublicView', **database_fields, **build_member_schema_dict("public", read))
MemberMemberView = create_model('MemberMemberView', **database_fields, **build_member_schema_dict("member", read))
MemberSelfView = create_model('MemberSelfView', **database_fields, **build_member_schema_dict("self", read))
MemberMasterView = create_model('MemberMasterView', **database_fields, **build_member_schema_dict("master", read))


# Edit models
MemberSelfPatch = create_model('MemberSelfPatch', **database_fields, **build_member_schema_dict("self", edit))
MemberMasterPatch = create_model('MemberMasterPatch', **database_fields, **build_member_schema_dict("master", edit))

MemberViewResponse = Union[MemberPublicView, MemberMemberView, MemberSelfView, MemberMasterView]


class MemberAuthentication(BaseModel):
    login_email: EmailStr
    hashed_password: str | None
