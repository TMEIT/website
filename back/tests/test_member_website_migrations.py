import uuid

import pytest
from pydantic import ValidationError

from tmeit_backend.schemas.member_website_migrations import MigrateForm


def test_gdpr_consent():
    good_request = MigrateForm(uuid=uuid.uuid4(),
                               security_token="a",
                               login_email="a@gmail.com",
                               password="adgabgarjglaagdafgg4g44gggg",
                               gdpr_consent=True)
    with pytest.raises(ValidationError):
        bad_request = MigrateForm(uuid=uuid.uuid4(),
                                  security_token="a",
                                  login_email="a@gmail.com",
                                  password="adgabgarjglaagdafgg4g44gggg",
                                  gdpr_consent=False)
