
# Flytta detta till members crud?

async def reset_password_create(db: AsyncSession, email: str) -> None:
    # Check if there is a user with the email address
    stmt = select()
    result = (await db.execute(
        models.Member)
        .where(models.Member.email == str(email))
        ).fetchone()
    
    if result is None:
        return
    
    uuid = uuid4()
    async with db.begin():
        db.add_all([
            PW_reset(uuid=str(uuid))
        ])

async def reset_password_change(db: AsyncSession, pw_uuid: UUID, data: ChangePassword) -> None:
    async with db.begin():
        # Check if there is a password reset request for pw_uuid key
        result = (select(models.PW_reset).where(models.PW_reset.reset_key = pw_uuid)).fetchone()
        
        if result is None:
            raise NotFoundError()
        
        # Change password
        user = (select(models.Member).where(models.Member.uuid = user_uuid)).fetchone
        if (user.uuid == result.uuid): # Sanity check that the uuids match
            user.hashed_password = ph.hash(data.new_password)

        # Remove record from reset database
        (select(models.PW_reset).where(models.PW_reset.reset_key = pw_uuid)).delete()