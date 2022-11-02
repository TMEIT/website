from .worker_tasks import functions
from .redis import redis_settings


# This file is the entrypoint for the tmeit-worker container. This file is not used by the app.

class WorkerSettings:
    """
    Configuration used to start the worker container

    functions is the list of functions that the worker can run (and the app can call)

    redis_settings defines how to connect to redis

    """
    functions = functions
    redis_settings = redis_settings
