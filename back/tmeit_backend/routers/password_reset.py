from pydantic import BaseModel
from arq import ArqRedis

from fastapi.responses import JSONResponse
from fastapi import Depends, status, APIRouter

from sqlalchemy.ext.asyncio import AsyncSession

from ..crud.password_reset import create_reset_token, check_reset_token, change_password_without_old_pw
from ._database_deps import get_db
from ..deps import get_worker_pool
from ..schemas.members.schemas import base64url_length_32

router = APIRouter()

class RequestReset(BaseModel):
    email: str

class ChangePassword(BaseModel):
    password: str

# User requests password reset
@router.put("/reset")
async def reset_password_request(
                                data: RequestReset,
                                db: AsyncSession = Depends(get_db),
                                pool: ArqRedis = Depends(get_worker_pool)
                                ):
    # Create reset token & store in database
    reset_token = await create_reset_token(db = db, email=data.email)
    if reset_token == None:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content=f'User with email {data.email} could not be found')
    # Send email to user
    await pool.enqueue_job('send_password_reset_email', email=data.email, reset_token=reset_token)

# Enter new password
@router.put("/reset/{token}")
async def reset_password_change_password(
                                        data: ChangePassword,
                                        token: str,
                                        email: str,
                                        db: AsyncSession = Depends(get_db)
                                         ):
    try:
        # Check if token exists
        user_uuid = await check_reset_token(db = db, reset_token=token, email=email)
        # Change password
        await change_password_without_old_pw(db=db, uuid=user_uuid, password=data.password)
        return JSONResponse(status_code=status.HTTP_200_OK,
            content=f'Password for user {user_uuid} changed')
    except KeyError as e:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content=str(e)) # No matching token found
    except ValueError as e:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST,
                            content=str(e)) # Password is not strong enough

