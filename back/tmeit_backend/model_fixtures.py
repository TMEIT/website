# model_fixtures.py
# Generates example data for our database for development and testing
import datetime
import random
import unicodedata

import factory
from argon2 import PasswordHasher

from tmeit_backend import models


class WorkteamFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = models.Workteam
        sqlalchemy_session = models.db.session

    @factory.lazy_attribute
    def symbol(self):
        """Choose a random greek letter."""
        symbol = chr(random.randrange(0x0391, 0x03aa))  # https://www.unicode.org/charts/PDF/U0370.pdf
        if symbol == '\u03a2':  # Avoid reserved character
            symbol = '\u0391'
        return symbol

    @factory.lazy_attribute
    def name(self):
        """Get name of the greek letter we chose."""
        letter = self.symbol
        return unicodedata.name(letter).split()[-1].capitalize()

    active = True
    active_year = 2020
    active_period = models.PeriodEnum.spring


class RoleHistoryFactory(factory.alchemy.SQLAlchemyModelFactory):
    """
    Creates a role history.

    Must be called with owner_email= argument or from a RelatedFactory within Member in order to link.
    """
    class Meta:
        model = models.RoleHistory
        sqlalchemy_session = models.db.session

    role = models.RoleOrTitle.marskalk
    start_date = factory.lazy_attribute(lambda a: datetime.date.today())


ph = PasswordHasher()
MEMBER_PASSWORD = 'password'


class MemberFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Creates a new member with a random name and the password 'password'."""
    class Meta:
        model = models.Member
        sqlalchemy_session = models.db.session

    first_name = "Test"
    nickname = "TT"
    last_name = "TMEIT"

    @factory.lazy_attribute
    def email(self):
        if self.nickname is not None:
            name = self.nickname.lower()
        else:
            name = f'{self.first_name.lower()}.{self.last_name.lower()}'
        return name + '@gmail.com'

    password_hash = ph.hash(MEMBER_PASSWORD)

    phone = "(555) 555-5555"
    drivers_license = True
    stad = True
    fest = False
    liquor_permit = False
    current_role = models.CurrentRoleEnum.marshal
    #role_histories = factory.RelatedFactory(RoleHistoryFactory, 'owner', )
