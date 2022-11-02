from .database import get_production_url, get_async_engine, get_async_session
from .worker_tasks import functions
from .redis import redis_settings, WorkerContext


# This file is the entrypoint for the tmeit-worker container. This file is not used by the app.


async def startup(ctx: WorkerContext):
    db_url = get_production_url()
    db_engine = get_async_engine(db_url, echo=True)
    ctx['db_session'] = get_async_session(db_engine)


class WorkerSettings:
    """
    Configuration used to start the worker container

    redis_settings defines how to connect to redis
    on_startup runs on every startup and can store things in the ctx dictionary
    functions is the list of functions that the worker can run (and the app can call)
    """
    redis_settings = redis_settings
    on_startup = startup
    functions = functions
