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
    member: APIAccessLevelsEnum     # API user is a active elected member of tmeit (there is no good word for it but in practice all members except for prao)
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

    "event_start":     FieldDescription(member=edit,    prao=read,    public=read,    type=datetime.date),
    "event_end":       FieldDescription(member=edit,    prao=read,    public=read,    type=Optional[datetime.date]),
    
    # "sign_up_end_time":     FieldDescription(member=edit,    prao=read,    public=read,    type=datetime.date),

    "title":                FieldDescription(member=edit,    prao=read,    public=read,    type=str),
    "description":          FieldDescription(member=edit,    prao=read,    public=read,    type=str),
    "location":             FieldDescription(member=edit,    prao=read,    public=read,    type=str),
    #"attending":            FieldDescription(member=edit,    prao=read,    public=read,    type=list[UUID]),

    # Fields that only are to visible and can only be edited by any TMEIT member
    "visibility":             FieldDescription(member=edit,    prao=read,    public=denied,    type=str),
    # Fields that can not be edited
    "time_created":         FieldDescription(member=read,    prao=read,    public=denied,    type=datetime.date),
    "time_updated":         FieldDescription(member=read,    prao=read,    public=denied,   type=datetime.date),
}

def build_events_schema_dict(
        permission_role: Literal["member"] | Literal["prao"] | Literal["public"],
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
        
# Always include uuid and short uuid in api requests/responses
database_fields_schema_dict = {
    "uuid": (UUID, Field(...)),
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
