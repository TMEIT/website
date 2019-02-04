import flask
import jwt
import requests

import datetime

from tmeit_backend import models

# Google Client ID for verifying that Google JWTs are ours
CLIENT_ID = '497107500705-ngsmiiqi3p6r1l5pp0gpfgnfqf7b8jcb.apps.googleusercontent.com'

# Issuer ('iss') field for our JWT tokens
ISSUER = 'TraditionsMEsterIT'


login_page = flask.Blueprint('login_page', __name__)


@login_page.route('/login', methods=['POST'])
def login():
    """ Log in a user by receiving a POST with a Google or KTH single-sign-on token, and respond with a JWT."""

    user = {}

    if flask.request.is_json:  # JWT in JSON payload, aka a Google JWT
        google_jwt = flask.request.json.get("access_token")
        if google_jwt is None:
            return flask.jsonify({"msg": "No token found"}), 400
        else:
            try:
                user = verify_google_token(google_jwt)
            except InvalidExternalTokenError as e:
                return flask.jsonify({"msg": str(e)}), 401
            except requests.exceptions.RequestException as e:
                return flask.jsonify({"msg": "Error verifying JWT on Google's servers.",
                                      "response": e.response}), 502

    elif flask.request.content_type == "application/xml":  # SAML token in XML payload, aka a KTH SAML token
        # TODO: Not implemented
        # try:
        #     verify_kth_token(None)
        # except InvalidExternalTokenError as e:
        #     return flask.jsonify({"msg": str(e)}), 401
        return flask.jsonify({"msg": "KTH login is not implemented yet"}), 501

    else:
        return flask.jsonify({"msg": "Invalid login token"}), 400

    # TODO: Verify that user exists
    if False:
        return flask.jsonify({"msg": "{} ({)) is not registered".encode(user['name'], user['email'])
                               }), 403

    # Create and return our login token
    access_token = generate_jwt(user)
    return flask.jsonify(access_token=access_token), 200


# Authentication Exceptions #
class InvalidExternalTokenError(RuntimeError):
    """Raised when a user tries to login with a external token that is invalid."""
    pass


# Functions for external tokens #
def verify_google_token(token):
    """ Takes a Google JWT "id_token", verifies it, and returns the user's email if the token was valid.

        We don't want to bother tracking google's current public key for JWT signing, so we just use Google's Oauth2
        tokeninfo API, at the cost of some performance on user login.
        https://developers.google.com/identity/sign-in/web/backend-auth#verify-the-integrity-of-the-id-token
        TODO: We could track Google's public key and verify tokens locally for a performance boost on login requests

        Raises:
            InvalidExternalTokenError: Token is signed incorrectly, not from Google, expired, the wrong audience, or
                does not contain an email claim. Token is not usable.
            requests.exceptions.RequestException: An HTTP error occurred while verifying the token with Google.

        Returns:
            A dict containing the logging-in user's email and full name, obtained from their login token
    """
    r = requests.get("https://oauth2.googleapis.com/tokeninfo?id_token=" + token )

    # Raise if Google says token is invalid
    if r.status_code == 400 and r.json()['error'] == "invalid_token":
        raise InvalidExternalTokenError("This Google JWT is invalid.")

    # Raise if we had an HTTP error aside form an invalid token
    r.raise_for_status()

    # Check that token matches our Client ID and isn't stolen from another service.
    validated_token = r.json()
    if validated_token['aud'] != CLIENT_ID:
        raise InvalidExternalTokenError("This Google JWT is not ours. Stealing is wrong!")

    return {'email':   validated_token['email'],
            'name':    validated_token['name']}


def verify_kth_token(token):  # Decode and verify KTH SAML tokens
    raise NotImplementedError("KTH login is not implemented yet.")


def generate_jwt(user):
    """ Generates a JWT for the user logging in, signed with the key in JWT_SECRET_KEY in the Flask config

    :param user: A dict containing the subject's email and full_name
    :return: A JWT
    """
    payload = {
            'iss': ISSUER,  # Token Issuer
            'iat': datetime.datetime.utcnow(),  # Token Issue Time
            'sub': user['email'],  # Token Recipient
            'name': user['full_name'],  # Recipients' full name
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=90)  # Token Expiration Time
        }
    return jwt.encode(payload, flask.current_app.config['JWT_SECRET_KEY'], algorithm='HS256')


# def verify_token(self, token: str, member_model: models.Member):
#     """ Verifies an incoming JWT token and returns the user's database object.
#
#     Tokens must be signed with our secret, and the 'iss' field must match {ISSUER}. Tokens must not be issued from
#     the future, and must not be expired.
#
#     Args:
#         token: The user's JWT to be verified
#         member_model: Our Flask-SQLAlchemy model for Members, so that we can look up the member in the database.
#
#     Raises:
#         jwt.exceptions.InvalidTokenError: Token received is not valid. Note that subclasses of this exception
#         are often used that specify the exact issue with the token.
#     """
#
#     # pyJWT does validation for us, and we select validation settings here.
#     decoded_token = jwt.decode(token, self.secret, issuer=ISSUER, algorithms='HS256')
#
#     # return the user's Member object from the database
#     return member_model.query.get(decoded_token['sub'])
