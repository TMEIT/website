import flask
import flask_restless

import os

from tmeit_backend import models, auth

# Create the Flask application and the Flask-SQLAlchemy object.
app = flask.Flask(__name__)


app.register_blueprint(auth.login_page)  # Add /login route


if os.environ.get("FLASK_TESTING") is not None:
    app.config.from_object("tmeit_backend.flask_cfg.TestingConfig")
    app.config['JWT_SECRET_KEY'] = 'dev'

elif app.config['ENV'] == "development":
    app.config.from_object("tmeit_backend.flask_cfg.DevelopmentConfig")
    app.config['JWT_SECRET_KEY'] = 'dev'

elif app.config['ENV'] == "production":
    app.config.from_object("tmeit_backend.flask_cfg.ProductionConfig")
    # Get secret for our JWT tokens from jwt_secret.txt when running in production
    try:
        with open('jwt_secret.txt') as secret_file:
            app.config['JWT_SECRET_KEY'] = secret_file.read()
    except FileNotFoundError:
        print("When running in production, we need jwt_secret.txt to sign JWTs with.")
        raise
    if len(app.config['JWT_SECRET_KEY']) < 30:
        raise RuntimeError("jwt_secret.txt is too weak.")
    if os.environ.get('SQLALCHEMY_DATABASE_URI') is None:  # Quit if we dont have a DB in production
        raise RuntimeError("Running in production and SQLALCHEMY_DATABASE_URI is not set!")

else:
    raise RuntimeError("Invalid config?")


# Init Flask-SQLAlchemy plugin
models.db.init_app(app)

# Create the Flask-Restless API manager
manager = flask_restless.APIManager(app, flask_sqlalchemy_db=models.db)

# Create API endpoints with our models, which will be available at /api/<tablename> by
# default. Allowed HTTP methods can be specified as well
manager.create_api(models.Workteam, methods=['GET'])


# start the flask loop
if __name__ == '__main__':
    app.run()
