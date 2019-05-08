# auth.google.py
# Handles KTH login tokens

import flask
from onelogin.saml2.idp_metadata_parser import OneLogin_Saml2_IdPMetadataParser
from onelogin.saml2.auth import OneLogin_Saml2_Auth

from urllib.parse import urlparse


# Frontend/Backend interaction during KTH authentication is described in this Stack Overflow answer:
# https://stackoverflow.com/a/44633010

# The backend code borrows heavily from the Flask example code for our SAML library, so check out their examples there.
# https://github.com/onelogin/python3-saml/tree/master/demo-flask


kth_blueprint = flask.Blueprint('kth_blueprint', __name__)


def init_saml_auth(flask_request):
    idp_data = OneLogin_Saml2_IdPMetadataParser.parse_remote("https://mds.swamid.se/md/swamid-idp.xml")

    # Reformat flask request to be read by SAML library
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

    auth = OneLogin_Saml2_Auth(onelogin_request)
    return auth


@kth_blueprint.route('/api/kth-login', methods=['GET'])
def kth_login():
    """Webpage for initiating a SAML login"""
    auth = init_saml_auth(flask_request=flask.request)
    raise NotImplementedError("KTH login is not implemented yet.")

