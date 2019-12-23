# wsgi.py
# Exposes our WSGI interface for uWSGI to hook into, this is our entry point when running full-scale

from tmeit_backend import main
from pathlib import Path
import os

DATABASE_PATH = os.getcwd() + '/database.sqlite3'

# Make sure we have a valid database
# TODO: We might be able to do some active db checks too to make sure nothing is blackholed
if Path(DATABASE_PATH).is_file() is False:
    raise FileNotFoundError("Database file not found, is it mounted to the Docker container?")

# Special "application" variable that uwsgi looks for and uses to run
application = main.create_app('sqlite:///' + DATABASE_PATH)

