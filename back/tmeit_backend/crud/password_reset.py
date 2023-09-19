# Create reset token
from uuid import UUID, uuid4
from arq import ArqRedis
from fastapi import Depends

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from .. import models
from ..auth import ph
from ..models import Member, PasswordReset
from ..deps import get_worker_pool
from ..schemas._check_password import is_password_strong

# Add a new reset token given an email address
async def create_reset_token(db: AsyncSession, email: str, pool: ArqRedis = Depends(get_worker_pool)):
    # Attempt to find user with matching email
    stmt = select(models.Member).where(models.Member.login_email == email)
    result_member = (await db.execute(stmt)).fetchone()
    if result_member == None:
        return None
    else:
        # Generate token & hash it
        reset_token = str(uuid4())
        hashed_reset_token = ph.hash(str(reset_token))
        # Stored hashed token and uuid
        db.add(PasswordReset(
            hashed_reset_token = str(hashed_reset_token),
            user_id = str(result_member.Member.uuid)
            ))
        return reset_token
    
# Check for existing reset token, return uuid of matching user if a token exists
async def check_reset_token(db: AsyncSession, reset_token: str):
    hashed_reset_token = ph.hash(reset_token)
    stmt = select(models.PasswordReset).where(models.PasswordReset.hashed_reset_token == str(hashed_reset_token))
    reset_db_entry = (await db.execute(stmt)).fetchone()
    if reset_db_entry == None:
        KeyError()
    else:
        return reset_db_entry.PasswordReset.user_id

# Copied from crud/memberse changed so that old password isn't required
async def change_password_without_old_pw(db: AsyncSession, password: str, uuid: UUID) -> None:
    async with db.begin():
        # Get entry in member table
        stmt = select(models.Member).where(models.Member.uuid == uuid)  # Using the UUID to prevent collisions for security
        result = (await db.execute(stmt)).fetchone()
        if result is None:
            raise KeyError()
        member = result.Member
        # Check that the new password is safe
        print(f'new password is {password}')
        password = is_password_strong(pw=password)
        member.hashed_password = ph.hash(password)
