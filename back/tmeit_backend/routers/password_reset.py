from pydantic import BaseModel
from ..schemas._check_password import is_password_strong

class RequestReset(BaseModel):
    email: str

class ChangePassword(BaseModel):
    password: str

# User requests password reset
@router.put("/reset/")
async def reset_password_request(db: AsyncSession = Depends(get_db)):
    # Create reset token & store in database & send email to user
    create_reset_token(email)
 

# Enter new password
@router.put("/reset/{token}")
async def reset_password_change_password(db: AsyncSession = Depends(get_db)):
    # Check if token exists
    user_uuid = check_reset_token(token)
    # Change password
    try:
        Crud.members.change_password(uuid, password)
    with ValueError:
        return 404NotFound
    return 200OK