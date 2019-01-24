import flask
import flask_restless

from tmeit_backend import models

# Create the Flask application and the Flask-SQLAlchemy object.
app = flask.Flask(__name__)
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.sqlite3'

# Init Flask-SQLAlchemy
models.db.init_app(app)

# Create the Flask-Restless API manager
manager = flask_restless.APIManager(app, flask_sqlalchemy_db=models.db)

# Create API endpoints with our models, which will be available at /api/<tablename> by
# default. Allowed HTTP methods can be specified as well
manager.create_api(models.Workteam, methods=['GET'])
manager.create_api(models.Member, methods=['GET'])

# start the flask loop
if __name__ == '__main__':
    app.run()


def create_all():
    """Create a new database and all the tables we need.

    Run this manually from the Python Shell, it should not be done automatically.
    """
    models.db.create_all(app=app)
    # (app=app is used to push the app context <http://flask-sqlalchemy.pocoo.org/2.3/contexts/>)
