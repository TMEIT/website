from arq.connections import RedisSettings
from sqlalchemy.ext.asyncio import AsyncSession

from typing import TypedDict, Callable, ContextManager

# Redis connection setting for arq
redis_settings = RedisSettings(host=[('rfs-redis', 26379)], sentinel=True, sentinel_master="mymaster")


# Type definition for the worker_task context
class WorkerContext(TypedDict):
    db_session: Callable[..., ContextManager[AsyncSession]]
