import random
import string
from uuid import uuid4

from fastapi import FastAPI

from .api_models.members.model import Member, base64url_length_8
from .api_models.members.enums import CurrentRoleEnum

# Our FastAPI sub-app for the v1 API
app = FastAPI()


def get_dummy_member(short_guid: base64url_length_8) -> Member:
    return Member(
        guid=uuid4(),
        short_guid=short_guid,
        email="lmao@lol.se",
        first_name="Rofl",
        last_name="Lmao",
        current_role=CurrentRoleEnum.master,
        role_histories=[],
        workteams=[],
        workteams_leading=[],
    )


@app.get("/members/", response_model=list[Member])
def get_members():
    random_short_guid = ''.join(random.choices(string.ascii_letters+string.digits+"-_", k=8))
    return [get_dummy_member(random_short_guid)]


@app.get("/members/{short_guid}", response_model=Member)
def get_member(short_guid: base64url_length_8):
    return get_dummy_member(short_guid)
