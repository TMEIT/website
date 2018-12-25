# model.py
# Defines our SQLAlchemy models


import flask_sqlalchemy
import enum
from typing import Dict


db = flask_sqlalchemy.SQLAlchemy()  # see documentation in class definition from flask_sqlalchemy


# Enums for our models to use #
class PeriodEnum(enum.IntEnum):
    """ Used to define what time of the year a workteam was active, typically Spring semester or Fall Semester. """
    spring = 0
    fall = 1


class RoleEnum(enum.IntEnum):  # TMEIT roles for members
    """Used to define what role a member has. Negative numbers are non-members."""
    master = 0
    marshal = 1
    prao = 2
    vraq = 3
    ex = 4
    inactive = 5
    exprao = -1
    pajas = 6  # klaengs special role
###############################


# Associative tables for our many-to-many relationships #
memberworkteam_table = db.Table('memberworkteam',
                                db.Column('workteam_id', db.Integer, db.ForeignKey('workteams.id')),
                                db.Column('member_id', db.Integer, db.ForeignKey('members.email')))
workteamleader_table = db.Table('workteamleader',
                                db.Column('workteam_id', db.Integer, db.ForeignKey('workteams.id')),
                                db.Column('leader_id', db.Integer, db.ForeignKey('members.email')))


# SQL Alchemy model definitions #
class Workteam(db.Model):
    """ SQL Alchemy model for TMEIT Workteams.

    Workteams typically are named after the Greek alphabet and can be active in events or inactive.

    Workteams can have a special symbol that will be presented visually in apps, and typically have a specific year and
    period when the team was active. Teams will have a number of members working in the team, and usually have two
    members who serve as team leaders for the workteam. Team leaders should be in both the members list and the
    team_leaders list for the workteam.

    Columns:
        id: Internal id for our database.
        name: The name of the workteam.
        symbol: The symbol associated with the workteam.
        team_leaders: The marskalkar that lead and organize the workteam.
        members: The people that are part of the work team.
        active: Whether or not a team is currently running events or is a historical team that is now inactive.
        active_year: The year that the workteam was or is active.
        active_period: The part of the year that the workteam was active. (i.e. fall/spring) Stored as a string or an
            int that corresponds to a value from PeriodEnum in this module.
    """

    __tablename__ = 'workteams'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.Unicode, nullable=False)
    symbol = db.Column(db.Unicode)
    team_leaders = db.relationship('Member', secondary=workteamleader_table, back_populates="workteams_leading")
    members = db.relationship('Member', secondary=memberworkteam_table, back_populates="workteams")
    active = db.Column(db.Boolean, nullable=False)
    active_year = db.Column(db.Integer)  # Year that the workteam was or is active
    active_period = db.Column(
        db.Enum(PeriodEnum))  # Part of the year that the workteam was active, (i.e. fall/spring)


class Member(db.Model):
    """ SQL Alchemy model for TMEIT Members.

    TMEIT members are stored in the database by their email address. (Usually a KTH email, but this may be a Gmail
    address if they are not a KTH student)
    Members can have a number of different roles in the klubbmästeri, both actively working or no longer active.

    Members can belong to many different workteams but should only be in one active workteam. Members can be given a
    nickname that they have earned, or have chosen themselves. We keep track of a member's phone number, what
    qualifications they have, and whether they are on the Kistan liquor license.

    Members can also be granted titles that represent roles that they have or special things that they have done, and
    the year that they held the role can also be recorded.

    Members may also be team leaders for the workteams they are a part of.

    Columns:
        email: The member's email address.
        first_name: The member's first name.
        nickname: The member's nickname, if they have one.
        last_name: The member's last name.
        phone: The member's phone number, if known.
        drivers_license: Whether the member has a driver's license in Sweden, if we know.
        stad: Whether the member has STAD qualifications, if we know.
        fest: Whether the member has attended FEST "training", if we know.
        liquor_permit: Whether the member is on our liquor permit.
        role: What role the member has in TMEIT. Stored as a string or an int that corresponde to a value in RoleEnum.
        titles: A CSV of the roles the member has had, with an optional year for each role.
        workteams: The workteams that the member has been in.
        workteams_leading: The workteams that the member has also been a team leader for.
    """

    __tablename__ = 'members'
    email = db.Column(db.Unicode, primary_key=True, nullable=False)
    first_name = db.Column(db.Unicode, nullable=False)
    nickname = db.Column(db.Unicode)
    last_name = db.Column(db.Unicode, nullable=False)
    phone = db.Column(db.Unicode)
    drivers_license = db.Column(db.Boolean)
    stad = db.Column(db.Boolean)
    fest = db.Column(db.Boolean)
    liquor_permit = db.Column(db.Boolean, nullable=False)
    role = db.Column(db.Enum(RoleEnum), nullable=False)
    titles = db.Column(db.Unicode)
    workteams = db.relationship('Workteam', secondary=memberworkteam_table, back_populates="members")
    workteams_leading = db.relationship('Workteam', secondary=workteamleader_table, back_populates="team_leaders")


def get_db() -> flask_sqlalchemy.SQLAlchemy:
    """Retrieves our db so it can initialized and so its session can be manipulated"""

    return db


def get_models():
    """Returns a dict of references to our SQL Alchemy models.

    db.init_app(app) must be called to initialize the db session before using the models!
    """

    return {
        'workteam': Workteam,
        'member': Member
    }
