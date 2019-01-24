import datetime

import jwt

from tmeit_backend import models

# Issuer ('iss') field for our JWT tokens
ISSUER = 'TraditionsMEsterIT'


# Authentication Exceptions #
class InvalidExternalTokenError(RuntimeError):
    """Raised when a user tries to login with a external token that is invalid."""
    pass


class UserDoesNotExistError(RuntimeError):
    """Raised when a user tries to login with a JWT or external token that does not correspond to an existing user.

    Args:
        message: Standard human-readable Error message
        invalid_user: Name that the user tried to login with, in the format "Full Name (email@address.com)".
    """
    def __init__(self, message: str, invalid_user: str):
        super().__init__(message)
        self.invalid_user = invalid_user


# Functions for external tokens #
# TODO accept and validate SAML and OAUTH tokens
def verify_google_token(token):  # Decode and verify Google oauth tokens
    return {'email': 'joe@gmail.com',
            'full_name': 'Joe Schmoe'}


def verify_kth_token(token):  # Decode and verify KTH SAML tokens
    raise NotImplementedError("KTH login is not implemented yet.")


class Authenticator:

    def __init__(self):
        # load secret from secret_file
        with open('jwt_secret.txt') as secret_file:
            self.secret = secret_file.read()
        if len(self.secret) < 30:
            raise RuntimeError("jwt_secret.txt is too weak.")

    def login(self, ext_token, login_type: str) -> str:
        """Accepts a user's login token and grants them a jwt token to stay logged in.

        Raises RuntimeErrors if the token is invalid or if the user is not registered.
        """

        if login_type == 'google':
            user = verify_google_token(ext_token)
        elif login_type == 'kth':
            user = verify_kth_token(ext_token)
        else:
            raise InvalidExternalTokenError("Unknown login type!")

        # TODO: Verify that user exists
        if False:
            raise UserDoesNotExistError(invalid_user=user['full_name'] + '(' + user['email'] + ')')

        payload = {
            'iss': ISSUER,  # Token Issuer
            'iat': datetime.datetime.utcnow(),  # Token Issue Time
            'sub': user['email'],  # Token Recipient
            'name': user['full_name'],  # Recipients' full name
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=90)  # Token Expiration Time
        }

        return jwt.encode(payload, self.secret, algorithm='HS256')

    def verify_token(self, token: str, member_model: models.Member):
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

        # pyJWT does validation for us, and we select validation settings here.
        decoded_token = jwt.decode(token, self.secret, issuer=ISSUER, algorithms='HS256')

        # return the user's Member object from the database
        return member_model.query.get(decoded_token['sub'])
