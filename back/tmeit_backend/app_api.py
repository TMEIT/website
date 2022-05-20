from uuid import UUID, uuid4

from fastapi import FastAPI

from .api_models.members.model import Member
from .api_models.members.enums import CurrentRoleEnum

# Our FastAPI sub-app for the v1 API
app = FastAPI()


def get_dummy_member(guid: UUID) -> Member:
    return Member(
        guid=guid,
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
    return [get_dummy_member(uuid4())]


@app.get("/members/{guid}", response_model=Member)
def get_member(guid: UUID):
    return get_dummy_member(guid)
