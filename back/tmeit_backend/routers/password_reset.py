from pydantic import BaseModel
from arq import ArqRedis

from fastapi.responses import JSONResponse
from fastapi import Depends, status, APIRouter

from sqlalchemy.ext.asyncio import AsyncSession

from ..crud.password_reset import create_reset_token, check_reset_token
from ..crud.members import change_password
from ._database_deps import get_db
from ..deps import get_worker_pool

router = APIRouter()

class RequestReset(BaseModel):
    email: str

class ChangePassword(BaseModel):
    password: str

# User requests password reset
@router.put("/reset/")
async def reset_password_request(
                                data: RequestReset,
                                db: AsyncSession = Depends(get_db),
                                pool: ArqRedis = Depends(get_worker_pool)
                                ):
    # Create reset token & store in database & send email to user
    create_reset_token(db = db, pool=pool, email=data.email)
 

# Enter new password
@router.put("/reset/{token}")
async def reset_password_change_password(
                                        data: ChangePassword,
                                        token: str,
                                        db: AsyncSession = Depends(get_db)
                                         ):
    # Check if token exists
    user_uuid = check_reset_token(token)
    # Change password
    try:
        change_password(user_uuid, ChangePassword.password)
        return JSONResponse(status_code=status.HTTP_200_OK,
            content="Password for user {user_uuid} changed")
    except ValueError:
        return JSONResponse(status_code =status.HTTP_404_NOT_FOUND,
                            content="No matching reset token found")

