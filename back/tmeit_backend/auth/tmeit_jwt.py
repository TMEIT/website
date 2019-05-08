# auth.tmeit_jwt.py
# Handles token generation and verification

import flask
import jwt
import datetime

from tmeit_backend import models


def generate_jwt(user) -> str:
    """ Generates a JWT for the user logging in, signed with the key in JWT_SECRET_KEY in the Flask config

    :param user: A dict containing the subject's email and full_name
    :return: A JWT
    """
    config = flask.current_app.config  # The app config is used to set issuer, secret key, and signing algorithm
    payload = {
            'iss': config['JWT_ISSUER'],  # Token Issuer
            'iat': datetime.datetime.utcnow(),  # Token Issue Time
            'sub': user['email'],  # Token Recipient
            'name': user['name'],  # Recipients' full name
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=90)  # Token Expiration Time
        }
    jwt_bytes = jwt.encode(payload, key=config['JWT_SECRET_KEY'], algorithm=config['JWT_ALGORITHM'])
    return jwt_bytes.decode("utf-8")


def verify_token(token: str, member_model: models.Member):
    """ Verifies an incoming JWT token and returns the user's database object.

    Tokens must be signed with our secret, and the 'iss' field must match {ISSUER}. Tokens must not be issued from
    the future, and must not be expired.

    Args:
        token: The user's JWT to be verified
        member_model: Our Flask-SQLAlchemy model for Members, so that we can look up the member in the database.

    Raises:
        jwt.exceptions.InvalidTokenError: Token received is not valid. Note that subclasses of this exception
        are often used that specify the exact issue with the token.
    """

    config = flask.current_app.config  # The app config is used to set issuer, secret key, and signing algorithm

    # pyJWT does validation for us, and we select validation settings here.
    decoded_token = jwt.decode(token, config['JWT_SECRET_KEY'], issuer=config['JWT_ISSUER'],
                               algorithm=config['JWT_ALGORITHM'])

    # return the user's Member object from the database
    return member_model.query.get(decoded_token['sub'])
