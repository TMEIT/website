import datetime
from typing import TypedDict, Any, Literal, Union, Optional, NamedTuple
from uuid import UUID

from pydantic import EmailStr, constr, create_model, Field, BaseModel, Extra, BaseConfig, validator

from .._check_password import is_password_strong
from ..access_levels import APIAccessLevelsEnum
from .enums import CurrentRoleEnum


# Pydantic models for member are defined programmatically,
# in order to generate different models for different API permission levels
# (e.g. don't return email in api if user is unauthenticated)


# permission level aliases
edit = APIAccessLevelsEnum.edit
read = APIAccessLevelsEnum.read
denied = APIAccessLevelsEnum.denied


class FieldDescription(TypedDict):
    """Type that we use to define a field and its different permissions"""

    # API permission levels
    master: APIAccessLevelsEnum     # API user is a Master/admin
    self: APIAccessLevelsEnum       # Member being accessed is the same as API user
    member: APIAccessLevelsEnum     # API user is a member of TMEIT
    public: APIAccessLevelsEnum     # API user is unauthenticated

    # Field type
    type: Any


FieldDict = dict[str, FieldDescription]


class FieldTuple(NamedTuple):
    field_type: Any
    default_value: Optional[Any]


member_fields: FieldDict = {

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
    "role_histories":   FieldDescription(master=read,   self=read, member=read,     public=denied, type=list[UUID]),
    "workteams":        FieldDescription(master=read,   self=read, member=read,     public=denied, type=list[UUID]),
    "workteams_leading":FieldDescription(master=read,   self=read, member=read,     public=denied, type=list[UUID]),

}


# 8 character base64url string
base64url_length_8 = constr(min_length=8, max_length=8, regex=r'[A-Za-z0-9\-_]{8}')
base64url_length_32 = constr(min_length=32, max_length=32, regex=r'[A-Za-z0-9\-_]{32}')

def build_member_schema_dict(
        permission_role: Literal["master"] | Literal["self"] | Literal["member"] | Literal["public"],
        api_access_level: APIAccessLevelsEnum,
        all_fields_optional: bool = False) -> dict[str, FieldTuple]:

    schema_dict: dict[str, FieldTuple] = {}

    for field_name, fd in member_fields.items():
        field_name: str
        fd: FieldDescription

        if fd[permission_role] >= api_access_level:  # Check permission level

            # Make all fields optional for patch schemas, since our PATCH endpoints only take 1 field
            if all_fields_optional is True:
                type = Optional[fd['type']]
            else:
                type = fd['type']

            # Add field to schema dict
            schema_dict[field_name] = FieldTuple(type, None)

    return schema_dict


# Always include uuid and short uuid in api requests/responses
database_fields_schema_dict = {
    "uuid": (UUID, Field(...)),
    "short_uuid": (base64url_length_8, Field(...)),
}


class PatchSchemaConfig(BaseConfig):
    """
    Special config that makes the patch schemas raise an explicit validation error when not used properly.

    When a PATCH endpoint is used with a field that isn't allowed,
    the model will raise a validation error so that the proposed patch changes aren't silently dropped.
    """
    extra = Extra.forbid


# Create Member schemas programmatically from our schema dicts
# https://pydantic-docs.helpmanual.io/usage/models/#dynamic-model-creation

# View schemas
MemberPublicView = create_model('MemberPublicView', **database_fields_schema_dict, **build_member_schema_dict("public", read))
MemberMemberView = create_model('MemberMemberView', **database_fields_schema_dict, **build_member_schema_dict("member", read))
MemberSelfView = create_model('MemberSelfView',     **database_fields_schema_dict, **build_member_schema_dict("self", read))
MemberMasterView = create_model('MemberMasterView', **database_fields_schema_dict, **build_member_schema_dict("master", read))


# Patch schemas
MemberSelfPatch = create_model('MemberSelfPatch',       __config__=PatchSchemaConfig, **build_member_schema_dict("self", edit, all_fields_optional=True))
MemberMasterPatch = create_model('MemberMasterPatch',   __config__=PatchSchemaConfig, **build_member_schema_dict("master", edit, all_fields_optional=True))

# Create schemas
MemberMasterCreate = create_model('MemberMasterCreate', **build_member_schema_dict("master", edit))

# Delete schemas
MemberMasterDelete = create_model('MemberMasterDelete', **build_member_schema_dict("master", edit))


# Union type for the read schemas
MemberViewResponse = Union[MemberMasterView, MemberSelfView, MemberMemberView, MemberPublicView]


class MemberAuthentication(BaseModel):
    login_email: EmailStr
    hashed_password: str | None


class ChangePassword(BaseModel):
    current_password: str
    new_password: str

    @validator('new_password')
    def check_password(cls, v):
        return is_password_strong(v)

class ResetPasswordChange(BaseModel):
    new_password: str
    @validator('new_password')
    def check_password(cls, v):
        return is_password_strong(v)