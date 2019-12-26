# auth.py
# Handles passwords, and token generation/verification

import flask
import jwt
import argon2
import datetime

from tmeit_backend import models

# Initialize Argon2 password hashing library
ARGON_ITERATIONS = 110  # Number of iterations we run of Argon2 (110 ~= 5 seconds on an i5 8350U)
ARGON_MEMORY = 102400  # (100MiB) Memory usage of generating a hash, in kibibytes
ARGON_PARALLELISM = 2  # Should be nThreads available on CPU * 2 (We use a single-thread Linode instance)
ARGON_HASH_LEN = 32  # Use a 256-bit hash instead of the 128-bit default
ARGON_SALT_LEN = 32  # Use a 256-bit salt instead of the 128-bit default
ph = argon2.PasswordHasher(time_cost=ARGON_ITERATIONS,
                           memory_cost=ARGON_MEMORY,
                           parallelism=ARGON_PARALLELISM,
                           hash_len=ARGON_HASH_LEN,
                           salt_len=ARGON_SALT_LEN)

login_page = flask.Blueprint('login_page', __name__)

# TODO: Use Flask-limiter for this
@login_page.route('/login', methods=['POST'])
def login():
    """ Log in a user by receiving a POST with an email address and password, and respond with a JWT."""

    if not flask.request.is_json:
        return flask.jsonify({"msg": "Bad Request"}), 400

    try:
        email = flask.request.json['email']
        password = flask.request.json['password']
    except KeyError:
        return flask.jsonify({"msg": "Bad Request"}), 400

    try:
        member = models.Member.query.get(email)
    except KeyError:
        return flask.jsonify({"msg": f'No user found with the email "{email}".'}), 403

    try:
        success = ph.verify(member.password_hash, password)
    except argon2.exceptions.VerifyMismatchError:
        return flask.jsonify({"msg": 'Invalid password.'}), 403

    if success:
        # Check if the member's hash is old/easy-to-crack and rehash if necessary
        if ph.check_needs_rehash(member.password_hash):
            member.password_hash = ph.hash(password)
        # Create and return our login token
        user = {
            'email': member.email,
            'name': f'{member.first_name} {member.last_name}'
        }
        access_token = generate_jwt(user)
        return flask.jsonify(access_token=access_token), 200


# Authentication Exceptions #
class InvalidExternalTokenError(RuntimeError):
    """Raised when a user tries to login with a external token that is invalid."""
    pass

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


def verify_token(token: str):
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
    return models.Member.query.get(decoded_token['sub'])
