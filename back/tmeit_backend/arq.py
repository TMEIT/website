import asyncio
from arq import create_pool
from arq.connections import RedisSettings

redis_settings = RedisSettings(host=[('rfs-redis', 26379)], sentinel=True, sentinel_master="mymaster")


async def yeet():
    await asyncio.sleep(10)


async def main():
    redis = await create_pool(redis_settings)


# WorkerSettings defines the settings to use when creating the work,
# it's used by the arq cli.
# For a list of available settings, see https://arq-docs.helpmanual.io/#arq.worker.Worker
class WorkerSettings:
    functions = [yeet]
    redis_settings = redis_settings
