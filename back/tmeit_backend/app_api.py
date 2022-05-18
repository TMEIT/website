from uuid import UUID

from fastapi import FastAPI

from .api_models.members.model import Member
from .api_models.members.enums import CurrentRoleEnum

# Our FastAPI sub-app for the v1 API
app = FastAPI()


@app.get("/members/{guid}", response_model=Member)
def get_member(guid: UUID):
    return Member(
        guid=guid,
        email="lmao@lol.se",
        first_name="lm",
        last_name="ao",
        current_role=CurrentRoleEnum.master,
        role_histories=[],
        workteams=[],
        workteams_leading=[],
    )
