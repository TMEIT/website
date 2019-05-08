# auth.google.py
# Handles KTH login tokens

from onelogin import saml2

idp_data = saml2.idp_metadata_parser.OneLogin_Saml2_IdPMetadataParser



def verify_kth_token(flask_request):
    """Decode and verify KTH SAML tokens"""

    raise NotImplementedError("KTH login is not implemented yet.")
