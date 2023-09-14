# Create reset token
from ..auth import ph
from uuid import UUID, uuid4

async def create_reset_token(db: AsyncSession, email: str):
    # Attempt to find user with matching email
    member = (await db.execute(
        select(models.Member).where(models.Member.login_email == str(email)
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


async def check_reset_token(db: AsyncSession, reset_token: str):
    hashed_reset_token = ph.hash(reset_token)
    reset_token_from_db = (await db.execute(
        select(models.PasswordReset).where(models.PasswordReset.hashed_reset_token == str(hashed_reset_token)
        )).fetchone())
    if reset_token_from_db == None:
        return 404Error
    else:
        return reset_token_from_db.uuid