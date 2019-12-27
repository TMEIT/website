# model_fixtures.py
# Generates example data for our database for development and testing
import datetime
import random
import unicodedata

import factory
import factory.random
from argon2 import PasswordHasher

from tmeit_backend import models


class WorkteamFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = models.Workteam
        sqlalchemy_session = models.db.session

    symbol = factory.Faker('lexify', text='?', letters='ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ')

    @factory.lazy_attribute
    def name(self):
        """Get name of the greek letter we chose."""
        letter = self.symbol
        return unicodedata.name(letter).split()[-1].capitalize()

    active = factory.Faker('pybool')
    active_year = factory.Faker('random_int', min=2000, max=2020)
    active_period = factory.lazy_attribute(lambda a: models.PeriodEnum(random.randrange(1)))


class RoleHistoryFactory(factory.alchemy.SQLAlchemyModelFactory):
    """
    Creates a role history.

    Must be called with owner_email= argument or from a RelatedFactory within Member in order to link.
    """
    class Meta:
        model = models.RoleHistory
        sqlalchemy_session = models.db.session

    role = models.RoleOrTitle.marskalk
    start_date = factory.Faker('date_object')
    end_date = datetime.date.today()


ph = PasswordHasher()
MEMBER_PASSWORD = 'password'


class MemberFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Creates a new member with a random name and the password 'password'."""
    class Meta:
        model = models.Member
        sqlalchemy_session = models.db.session

    first_name = factory.Faker('first_name')
    nickname = None
    last_name = factory.Faker('last_name')

    @factory.lazy_attribute
    def email(self):
        if self.nickname is not None:
            name = self.nickname.lower()
        else:
            name = f'{self.first_name.lower()}.{self.last_name.lower()}'
        return name + '@gmail.com'

    password_hash = ph.hash(MEMBER_PASSWORD)

    phone = factory.Faker('phone_number', locale='sv_SE')
    drivers_license = factory.Faker('pybool')
    stad = factory.Faker('pybool')
    fest = factory.Faker('pybool')
    liquor_permit = factory.Faker('pybool')
    current_role = factory.lazy_attribute(lambda a: models.CurrentRoleEnum(random.randint(-1, 5)))
    # role_histories = factory.RelatedFactory(RoleHistoryFactory, 'owner', )


def generate_dev_data(app):
    with app.app_context():

        for i in range(100):
            member = MemberFactory()
            RoleHistoryFactory(owner=member)
        models.db.session.commit()

        for i in range(50):
            workteam = WorkteamFactory()
            workteam.members += random.choices(models.Member.query.all(),
                                               k=random.randint(5, 25))
        models.db.session.commit()
