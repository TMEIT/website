from arq import ArqRedis
from fastapi import Depends, status, APIRouter
from fastapi.responses import JSONResponse

from ._database_deps import get_current_user
from ._error_responses import ForbiddenResponse
from ..deps import get_worker_pool
from ..schemas.members.schemas import MemberSelfView


router = APIRouter()


@router.post("/send_test_email", status_code=202, responses={403: {"model": ForbiddenResponse}})
async def send_test_email(validator_random_user: str,
                          current_user: MemberSelfView = Depends(get_current_user),
                          pool: ArqRedis = Depends(get_worker_pool)):
    """Sends an email to a given DKIM Validator address for testing email security. (Masters only)"""
    if current_user is None or current_user.current_role != "master":
        return JSONResponse(status_code=status.HTTP_403_FORBIDDEN,
                            content={"error": f"Only masters can send test emails."})
    await pool.enqueue_job('send_test_email_to_dkimvalidator', validator_random_user)
    return "Email job submitted."
