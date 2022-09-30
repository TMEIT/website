from tmeit_backend.schemas.members import schemas
from tmeit_backend.schemas.access_levels import APIAccessLevelsEnum


def test_read_memberschema():
    properties = schemas.MemberMemberView.schema()['properties']
    readable_fields = set(schemas.database_fields_schema_dict) \
        | {field for field, perms in schemas.member_fields.items() if perms['member'] in (APIAccessLevelsEnum.edit, APIAccessLevelsEnum.read)}
    assert set(properties.keys()) == readable_fields  # Correct fields are included


def test_patch_memberschema():
    properties = schemas.MemberSelfPatch.schema()['properties']
    writable_fields = {field for field, perms in schemas.member_fields.items() if perms['self'] == APIAccessLevelsEnum.edit}
    assert set(properties.keys()) == writable_fields  # Correct fields are included
    assert 'required' not in schemas.MemberSelfPatch.schema() # All fields are Optional

