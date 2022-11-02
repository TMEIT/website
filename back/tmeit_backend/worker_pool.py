from arq import create_pool

from .redis import redis_settings


# Global var for the redis connection to the workers, initalized by init_pool() when the app starts
pool = {}


async def init_pool():
    pool['pool'] = await create_pool(redis_settings)

# Note, available jobs that can be called are defined in worker_tasks/__init__.py:functions
