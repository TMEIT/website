from tmeit_backend import models, auth

from typing import Dict


def create_auth_payload(auth_member: models.Member, payload: Dict):
    payload = payload.copy()
    payload.update(auth=auth.generate_jwt(auth_member))
    return payload
