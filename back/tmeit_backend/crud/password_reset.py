from typing import TypeVar, Type
from uuid import UUID, uuid4

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select


from ..models import Member, PWReset, models
from ..schemas.members.schemas import ResetPasswordRequest, ResetPasswordChange


router = APIRouter()
# Handle requets for reseting password: Create a record in the PW_reset table
async def reset_password_request(db: AsyncSession, request_email: str) -> None:
    # Check if there is a user with the email address
    stmt = select()
    result = (await db.execute(
        models.Member)
        .where(models.Member.email == str(request_email))
        ).fetchone()
    
    if result is None:
        return
    
    uuid = uuid4()
    async with db.begin():
        db.add_all([
            PWReset(uuid=str(uuid)) # How to add relationship to user here?
        ])

# Remember to pass pw_uuid as parameter, this value should be taken from the url used to make the request
async def reset_password_change(db: AsyncSession, pw_uuid: str, data: ResetPasswordChange) -> None:
    async with db.begin():
        # Check if there is a record in PWReset for pw_uuid
        result = (select(models.PWReset).where(models.PWReset.reset_key == pw_uuid)).fetchone()
        
        if result is None:
            raise KeyError()
        
        # Change password
        user = (select(models.Member).where(models.Member.uuid == result.user_id)).fetchone
        if (user.uuid == result.uuid): # Sanity check that the uuids match
            user.hashed_password = ph.hash(data.new_password)

        # Remove record from reset database
        (select(models.PWReset).where(models.PWReset.reset_key == pw_uuid)).delete()