# auth.google.py
# Handles KTH login tokens

import flask
from onelogin.saml2.idp_metadata_parser import OneLogin_Saml2_IdPMetadataParser
from onelogin.saml2.auth import OneLogin_Saml2_Auth
from onelogin.saml2.settings import OneLogin_Saml2_Settings

from urllib.parse import urlparse


# Frontend/Backend interaction during KTH authentication is described in this Stack Overflow answer:
# https://stackoverflow.com/a/44633010

# The backend code borrows heavily from the Flask example code for our SAML library, so check out their examples there.
# https://github.com/onelogin/python3-saml/tree/master/demo-flask


kth_blueprint = flask.Blueprint('kth_blueprint', __name__)


url = "https://tmeit.insektionen.se"


# FIXME: Temporary cert loading
with open("tmeit_backend/saml.crt") as CERT_FILE:
    CERT = CERT_FILE.read()
with open("tmeit_backend/saml.pem") as KEY_FILE:
    KEY = KEY_FILE.read()


# Config #

# If strict is True, then the Python Toolkit will reject unsigned
# or unencrypted messages if it expects them to be signed or encrypted.
# Also it will reject the messages if the SAML standard is not strictly
# followed. Destination, NameId, Conditions ... are validated too.
CONFIG_STRICT = True

# Enable debug mode (outputs errors).
CONFIG_DEBUG = True

# Configuration for the SAML Service Provider
SP_CONFIG = {
            # Identifier of the SP entity  (must be a URI)
            "entityId": url + "/api/saml-metadata/",
            # Specifies info about where and how the <AuthnResponse> message MUST be
            # returned to the requester, in this case our SP.
            "assertionConsumerService": {
                # URL Location where the <Response> from the IdP will be returned
                "url": url + "/api/kth-callback?acs",
                # SAML protocol binding to be used when returning the <Response>
                # message. OneLogin Toolkit supports this endpoint for the
                # HTTP-POST binding only.
                "binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
            },

            # "attributeConsumingService": {
            #         "serviceName": "TMEIT Website Login",
            #         "serviceDescription": "TraditionsMEsterIT (TMEIT) är ett klubbmästeri vid Sektionen för "
            #                               "Informations- och Nanoteknik som har sitt säte vid Kungliga Tekniska "
            #                               "högskolan i Kista.",
            # },
            # Specifies the constraints on the name identifier to be used to
            # represent the requested subject.
            # Take a look on src/onelogin/saml2/constants.py to see the NameIdFormat that are supported.
            "NameIDFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
            # Usually X.509 cert and privateKey of the SP are provided by files placed at
            # the certs folder. But we can also provide them with the following parameters
            "x509cert": CERT,
            "privateKey": KEY

            # Key rollover
            # If you plan to update the SP X.509cert and privateKey
            # you can define here the new X.509cert and it will be
            # published on the SP metadata so Identity Providers can
            # read them and get ready for rollover.

            # 'x509certNew': '',
        }


# Advanced Config #

CONTACT_PERSON_CONFIG = {
    "administrative": {
        "givenName": "TraditionsMästare",
        "emailAddress": "tm@tmeit.se"
    },
    "technical": {
        "givenName": "Justin Lex-Hammarskjöld",
        "emailAddress": "jtlex8@gmail.com"
    }
}

ORGANIZATION_CONFIG = {
    "en-US": {
        "name": "TMEIT",
        "displayname": "TraditionsMEsterIT",
        "url": "https://tmeit.se"
    },
    "sv_SE": {
        "name": "TMEIT",
        "displayname": "TraditionsMEsterIT",
        "url": "https://tmeit.se"
    }
}


def get_settings_instance() -> OneLogin_Saml2_Settings:
    """Builds our SAML settings/metadata by fetching KTH's metadata and combining it with our own."""
    # Pull KTH's ID Provider (IdP) metadata
    idp_data = OneLogin_Saml2_IdPMetadataParser.parse_remote(url="https://mds.swamid.se/md/swamid-idp.xml",
                                                             entity_id="https://saml.sys.kth.se/idp/shibboleth",
                                                             validate_cert=True)  # (validates https connection
    settings = {  # Combine our Service Provider (SP) config with IdP metadata
        "strict": CONFIG_STRICT,
        "debug": CONFIG_DEBUG,
        "sp": SP_CONFIG,
        **idp_data
    }

    return OneLogin_Saml2_Settings(settings=settings)


# Request helper functions #

def unpack_request(flask_request):
    """Reformat Flask request to be read by SAML library"""

    onelogin_request = {
        # SAML library says to use HTTP_X_FORWARDED to get hostname and port since we're behind a proxy, but flask seems
        # to decode proxies just fine by default.
        'http_host': flask_request.host,
        'server_port': urlparse(flask_request.url).port,
        'script_name': flask_request.path,
        'get_data': flask_request.args.copy(),
        'post_data': flask_request.form.copy(),

        'https': 'on' if flask_request.scheme == 'https' else 'off',  # Usually we use HTTPS, but local testing uses
                                                                      # HTTP so this needs to be dynamic
        "request_uri": "/api/login"
    }
    return onelogin_request


def init_saml_auth(onelogin_request):
    """ Creates a new OneLogin_Saml2_Auth with our formatted request and our settings """

    # noinspection PyTypeChecker
    return OneLogin_Saml2_Auth(request_data=onelogin_request, old_settings=get_settings_instance())


# Routes #

@kth_blueprint.route('/api/kth-login', methods=['GET'])
def kth_login():
    """Webpage for initiating a SAML login"""
    onelogin_request = unpack_request(flask.request)
    auth = init_saml_auth(onelogin_request=onelogin_request)
    flask.current_app.logger.debug(auth.login())
    return flask.redirect(auth.login(return_to=url))  # TODO: Make this dynamic so user returns to right page


@kth_blueprint.route('/api/saml-metadata', methods=['GET'])
def saml_metadata():
    """Publishes metadata for this SAML Service Provider"""

    # Generate metadata
    saml_settings = get_settings_instance()
    metadata = saml_settings.get_sp_metadata()

    # Validate metadata
    errors = saml_settings.validate_metadata(metadata)
    if len(errors) != 0:
        error_string = "<h1>Error(s) occurred generating Service Provider metadata.</h1>\n"
        for error in errors:
            error_string += f"<p>{error}</p>\n"
        return error_string, 501

    else:
        return flask.Response(metadata, mimetype='text/xml'), 200


# TODO: Lifecycle:

# Send user to KTH (Initiate SSO, /api/kth-login)
    # return_to=https://tmeit.se/?TOKEN
# Receive token (Attribute Consumer Service, /api/kth-authenticate)
    # Hold onto token to prevent replay attack
    # Wait no HTTPS prevents that lol