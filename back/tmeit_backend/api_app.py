import flask
import flask_restless

import os

from tmeit_backend import models, auth


def create_app(database_uri, debug=False, testing=False) -> flask.Flask:
    # Create the Flask application and the Flask-SQLAlchemy object.
    app = flask.Flask(__name__)

    # configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = database_uri
    if debug is True:
        app.config['ENV'] = 'development'
    else:
        app.config['ENV'] = 'production'
    app.config['TESTING'] = testing

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable a depreciated feature in flask_sqlalchemy
    if app.config['ENV'] == "development":
        app.config['JWT_SECRET_KEY'] = 'dev'  # Set a default JWT secret
    else:
        # Get secret for our JWT tokens from jwt_secret.txt when running in production
        try:
            with open('jwt_secret.txt') as secret_file:
                app.config['JWT_SECRET_KEY'] = secret_file.read()
        except FileNotFoundError:
            print("When running in production, we need a jwt_secret.txt to sign JWTs with.")
            raise
        if len(app.config['JWT_SECRET_KEY']) < 30:
            raise RuntimeError("jwt_secret.txt is too weak.")

    # Add /login route
    app.register_blueprint(auth.login_page)

    # Init Flask-SQLAlchemy plugin
    models.db.init_app(app)

    # Create the Flask-Restless API manager
    manager = flask_restless.APIManager(app, flask_sqlalchemy_db=models.db)

    # Create API endpoints with our models, which will be available at /api/<tablename> by
    # default. Allowed HTTP methods can be specified as well
    manager.create_api(models.Workteam, methods=['GET'])

    return app


# start the flask loop
if __name__ == '__main__':
    app = create_app('sqlite://', debug=True, testing=False)
    app.run()
