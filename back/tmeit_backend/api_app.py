# api_app.py
# Factory for our Flask app that implements our backend API

import flask
from sqlalchemy.exc import OperationalError

from tmeit_backend import models, auth, crud_api, dummy_entries


def create_app(database_uri, debug=False, testing=False) -> flask.Flask:
    # Create the Flask application and the Flask-SQLAlchemy object.
    app = flask.Flask(__name__)

    # FLASK CONFIGURATION #
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

    # Add /login route
    app.register_blueprint(auth.login_page)

    # Init Flask-SQLAlchemy plugin
    models.db.init_app(app)

    # Generate adummy database if needed
    if app.config["ENV"] == 'development':
        try:
            with app.app_context():  # See if members table exists
                models.db.session.connection().execute(
                    "SELECT * FROM members"
                )
        except OperationalError:
            generate_dev_db(app)

    # Add crud routes (Will be under /api/)
    crud_api.add_crud_routes(app)

    return app


def generate_dev_db(app):
    app.logger.info("Running in dev mode, and no database was found.\n"
                    "Generating a new dummy database.")
    with app.app_context():
        models.db.create_all()

    test_team = models.Workteam(
        name=dummy_entries.TEST_TEAM_NAME,
        symbol=dummy_entries.TEST_SYMBOL,
        active=dummy_entries.TEST_ACTIVE,
        active_year=dummy_entries.TEST_ACTIVE_YEAR,
        active_period=dummy_entries.TEST_ACTIVE_PERIOD
    )

    test_user = models.Member(
        email=dummy_entries.TEST_EMAIL,
        first_name=dummy_entries.TEST_FIRST_NAME,
        nickname=dummy_entries.TEST_NICKNAME,
        last_name=dummy_entries.TEST_LAST_NAME,
        phone=dummy_entries.TEST_PHONE,
        drivers_license=dummy_entries.TEST_DRIVERS_LICENSE,
        stad=dummy_entries.TEST_STAD,
        fest=dummy_entries.TEST_FEST,
        liquor_permit=dummy_entries.TEST_LIQUOR_PERMIT,
        current_role=dummy_entries.TEST_CURRENT_ROLE,
        workteams=[test_team],
        workteams_leading=[test_team]
    )

    with app.app_context():
        models.db.session.add(test_team)
        models.db.session.add(test_user)
        models.db.session.commit()
