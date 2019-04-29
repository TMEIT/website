#! /usr/bin/python3
# Creates a test db to use for local testing

import os
from tmeit_backend import api_app
from tests import conftest

app = api_app.create_app('sqlite:///{}/database.sqlite3'.format(os.getcwd()), debug=True, testing=False)

conftest.create_test_db(app)
