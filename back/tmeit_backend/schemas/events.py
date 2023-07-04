import datetime
from uuid import UUID
from typing import TypedDict, Any, Literal, Union, Optional, NamedTuple
from .members.enums import CurrentRoleEnum
from .access_levels import APIAccessLevelsEnum
from pydantic import constr, Field, BaseConfig, create_model, Extra

# permission level aliases
edit = APIAccessLevelsEnum.edit
read = APIAccessLevelsEnum.read
denied = APIAccessLevelsEnum.denied

class FieldDescription(TypedDict):
    """Type that we use to define a field and its different permissions"""

    # API permission levels
    master: APIAccessLevelsEnum     # API user is a Master/admin
    member: APIAccessLevelsEnum     # API user is a member of TMEIT
    prao: APIAccessLevelsEnum       # API user is prao
    public: APIAccessLevelsEnum     # API user is unauthenticated

    # Field type
    type: Any

FieldDict = dict[str, FieldDescription]

class FieldTuple(NamedTuple):
    field_type: Any
    default_value: Optional[Any]


event_fields: FieldDict = {
    # Fields that are visible to everyone and can be edited by any TMEIT member
    "event_time":           FieldDescription(master=edit,  member=edit,    prao=read,    public=read,    type=datetime.date),
    "sign_up_end_time":     FieldDescription(master=edit,  member=edit,    prao=read,    public=read,    type=datetime.date),
    "title":                FieldDescription(master=edit,  member=edit,    prao=read,    public=read,    type=str),
    "description":          FieldDescription(master=edit,  member=edit,    prao=read,    public=read,    type=str),
    "location":             FieldDescription(master=edit,  member=edit,    prao=read,    public=read,    type=str),
    "attending":            FieldDescription(master=edit,  member=edit,    prao=read,    public=read,    type=list[UUID]),

    # Fields that only are to visible and can be edited by any TMEIT member
    "visibility":             FieldDescription(master=edit,  member=edit,    prao=read,    public=denied,    type=CurrentRoleEnum),
    # Fields that can not be edited
    "time_created":         FieldDescription(master=read,  member=read,    prao=read,    public=denied,    type=datetime.date),
    "time_updated":         FieldDescription(master=read,  member=read,    prao=read,    public=denied,   type=datetime.date),
}

def build_events_schema_dict(
        permission_role: Literal["master"] | Literal["member"] | Literal["prao"] | Literal["public"],
        api_access_level: APIAccessLevelsEnum) -> dict[str, FieldTuple]:

    schema_dict: dict[str, FieldTuple] = {}


    for field_name, fd in event_fields.items():
        field_name: str
        fd: FieldDescription

        if fd[permission_role] >= api_access_level:  # Check permission level

            type = fd['type']

            # Add field to schema dict
            schema_dict[field_name] = FieldTuple(type, None)

    return schema_dict
        
# 8 character base64url string
base64url_length_8 = constr(min_length=8, max_length=8, regex=r'[A-Za-z0-9\-_]{8}')
        
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

# View schemas
EventPublicView = create_model('EventPublicView', **database_fields_schema_dict, **build_events_schema_dict("public", read))
EventPraoView = create_model('EventPraoView', **database_fields_schema_dict, **build_events_schema_dict("prao", read))
EventMemberView = create_model('EventMemberView', **database_fields_schema_dict, **build_events_schema_dict("member", read))

# Patch schemas
EventMemberPatch = create_model('EventMemberPatch',   __config__=PatchSchemaConfig, **build_events_schema_dict("member", edit))

# Create schemas
EventMemberCreate = create_model('EventMemberCreate', **build_events_schema_dict("member", edit))

# Union type for the read schemas
EventViewResponse = Union[EventMemberView, EventPraoView, EventPublicView]
