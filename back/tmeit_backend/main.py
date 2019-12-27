# main.py
# Factory for our Flask app that implements our backend API

import flask
from sqlalchemy.exc import OperationalError

from tmeit_backend import models, auth, endpoints, model_fixtures


def create_app(database_uri, debug=False, testing=False) -> flask.Flask:
    """Flask App Factory"""
    # Create the Flask application object
    app = flask.Flask(__name__)

    # Configure it
    configure_app(app, database_uri, debug, testing)

    # Add /login route
    app.register_blueprint(auth.login_page)

    # Register our app with Flask-SQLAlchemy
    models.db.init_app(app)

    # Generate an empty database for dev servers and testing
    if app.config["ENV"] == 'development':

        with app.app_context():
            models.db.create_all()

        # Also generate example data when running a dev server
        if app.config['TESTING'] is not True:
            app.logger.warning("Generating example data for the database.")

            with app.app_context():
                model_fixtures.WorkteamFactory()
                model_fixtures.MemberFactory()
                model_fixtures.RoleHistoryFactory(owner_email="tt@gmail.com")
                models.db.session.commit()

    # Generate our model-based rest API and register it with Flask
    app.register_blueprint(endpoints.generate_endpoints(app))

    return app


def configure_app(app, database_uri, debug, testing):
    """Sets up the Flask configuration for our app."""
    app.config['SQLALCHEMY_DATABASE_URI'] = database_uri
    if debug is True:
        app.config['ENV'] = 'development'
    else:
        app.config['ENV'] = 'production'
    app.config['TESTING'] = testing

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable a depreciated feature in flask_sqlalchemy

    # We always use HMAC SHA-256 to sign our JWTs
    app.config['JWT_ALGORITHM'] = 'HS256'
    # Google Client ID for verifying that Google JWTs are ours ('aud' claim in Google's id_client JWTs)
    app.config['GOOGLE_CLIENT_ID'] = '497107500705-ngsmiiqi3p6r1l5pp0gpfgnfqf7b8jcb.apps.googleusercontent.com'
    # Issuer ('iss') claim for our JWT tokens
    app.config['JWT_ISSUER'] = 'TraditionsMEsterIT'

    # Set our JWT secret
    if app.config['ENV'] == "development":
        app.config['JWT_SECRET_KEY'] = 'dev'  # Default JWT secret
    else:
        # Always get secret for our JWT tokens from jwt_secret.txt when running in production
        try:
            with open('jwt_secret.txt') as secret_file:
                app.config['JWT_SECRET_KEY'] = secret_file.read()
        except FileNotFoundError:
            print("When running in production, we need a jwt_secret.txt to sign JWTs with.\n"
                  "jwt_secret.txt should be a text file with at least 30 random UTF-8 characters generated from "
                  "/dev/random\n"
                  "If running in Docker, the file should be mounted to /srv/api/jwt_secret.txt")
            raise
        if len(app.config['JWT_SECRET_KEY']) < 30:
            raise RuntimeError("jwt_secret.txt is too weak.")
