# Create reset token
from uuid import UUID, uuid4
from arq import ArqRedis
from fastapi import Depends

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from ..auth import ph
from ..models import Member, PasswordReset
from ..deps import get_worker_pool

# Add a new reset token given an email address
async def create_reset_token(db: AsyncSession, email: str, pool: ArqRedis = Depends(get_worker_pool)):
    # Attempt to find user with matching email
    member = (await db.execute(
        select(Member).where(Member.login_email == str(email)
        )).fetchone())
    if member == None:
        return
    else:
        # Generate token & hash it
        reset_token = uuid4()
        hashed_reset_token = ph.hash(reset_token)
        # Stored hashed token and uuid
        async with db.begin():
            db.add(PasswordReset(
                hashed_reset_token = str(hashed_reset_token),
                uuid = str(member.uuid)
                ))
        await pool.enqueue_job('send_password_reset_email', member.email) # Having this here lowers code cohesion but I think it makes sense, since you would have to return email and the reset token otherwise

# Check for existing reset token, return uuid of connected user if a token exists
async def check_reset_token(db: AsyncSession, reset_token: str):
    hashed_reset_token = ph.hash(reset_token)
    reset_token_from_db = (await db.execute(
        select(PasswordReset).where(PasswordReset.hashed_reset_token == str(hashed_reset_token)
        )).fetchone())
    if reset_token_from_db == None:
        KeyError()
    else:
        return reset_token_from_db.uuid