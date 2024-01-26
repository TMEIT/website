# Create reset token
from uuid import UUID, uuid4
from arq import ArqRedis
from fastapi import Depends
import datetime, os, base64

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql.functions import func

from .. import models
from ..auth import ph
from ..models import PasswordReset
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
        reset_token = base64.urlsafe_b64encode(os.urandom(30)).decode()
        # Stored hashed token and uuid
        db.add_all([
            PasswordReset(hashed_reset_token=reset_token, 
                          user_id=result_member.Member.uuid),
        ])
        return reset_token
    
# Check for existing reset token, return uuid of matching user if a token exists
async def check_reset_token(db: AsyncSession, reset_token: str, email: str):
    # Find UUID
    stmt = select(models.Member).where(models.Member.login_email == email)
    result_member = (await db.execute(stmt)).fetchone()
    if result_member == None:
        raise KeyError('Invalid email address')
    member_uuid = result_member.Member.uuid
    # Find hashed token. A user can create several tokens, fetch & check all of them

    stmt = select(models.PasswordReset).where(models.PasswordReset.user_id == member_uuid)
    reset_db_entries = (await db.execute(stmt)).fetchall()
    if reset_db_entries == []:
        raise KeyError(f'Invalid reset token1')

    # Check if any entries match the given reset_token
    reset_db_entry = None
    for entry in reset_db_entries:
        if (entry.hashed_reset_token == reset_token):
            reset_db_entry = entry
    if reset_db_entry == None:
        raise KeyError(f'Invalid reset token2') # No matching hash
    
    # Check if the time limit of the token is exceeded (24 h)
    if (func.now() - reset_db_entry.PasswordReset.time_created) < datetime.timedelta(days = 1):
        # Delete all reset tokens for this user
        stmt = select(models.PasswordReset).where(models.PasswordReset.user_id == reset_db_entry.PasswordReset.uuid)
        await db.execute(stmt).delete()
        # Return userid
        return member_uuid
    else:
        raise KeyError('Reset token expired') # No valid reset key
    
# Copied from crud/memberse changed so that old password isn't required
async def change_password_without_old_pw(db: AsyncSession, password: str, uuid: UUID) -> None:
    # Get entry in member table
    stmt = select(models.Member).where(models.Member.uuid == uuid)  # Using the UUID to  event collisions for security
    result = (await db.execute(stmt)).fetchone()
    if result is None:
        raise KeyError()
    member = result.Member
    # Check that the new password is safe
    password = is_password_strong(pw=password)
    member.hashed_password = ph.hash(password)
