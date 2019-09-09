# crud_api.py
# Creates our CRUD API for our database

import flask_restless

from tmeit_backend import models

def pre_put_member(*args, **kwargs):
    # authentication if needed
    # pre-filled fields
    pass


def add_crud_routes(app):
    manager = flask_restless.APIManager(app, flask_sqlalchemy_db=models.db)

    # Create API endpoints with our models, which will be available at /api/<tablename> by
    # default. Allowed HTTP methods can be specified as well
    manager.create_api(models.Workteam, methods=['GET'])
    manager.create_api(models.Member, methods=['GET'])
