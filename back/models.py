# model.py
# Defines our SQLAlchemy models

# Our Flask app passes in the current db session from Flask_SQLAlchemy into generate_models(), and we then return the
# models in a dict for the app to use.

from enum import IntEnum


# Enums for our models to use #
class PeriodEnum(IntEnum):
    """ Used to define what time of the year a workteam was active, typically Spring semester or Fall Semester. """
    spring = 0
    fall = 1


class RoleEnum(IntEnum):  # TMEIT roles for members
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


def generate_models(db):
    """Takes a db session from Flask_SQLAlchemy and defines user models for it.

    References to the model objects are returned in a dictionary with lowercase strings of their names as keys.
    """

    # Associative tables for our many-to-many relationships #
    memberworkteam_table = db.Table('memberworkteam',
                                    db.Column('workteam_id', db.Integer, db.ForeignKey('workteams.id')),
                                    db.Column('member_id', db.Integer, db.ForeignKey('members.email'))
                                    )
    workteamleader_table = db.Table('workteamleader',
                                    db.Column('workteam_id', db.Integer, db.ForeignKey('workteams.id')),
                                    db.Column('leader_id', db.Integer, db.ForeignKey('members.email'))
                                    )

    # Data models #
    class Workteam(db.Model):
        __tablename__ = 'workteams'
        id = db.Column(db.Integer, primary_key=True, nullable=False)
        name = db.Column(db.Unicode, nullable=False)
        symbol = db.Column(db.Unicode)
        team_leaders = db.relationship('Member', secondary=workteamleader_table, back_populates="workteams_leading")
        members = db.relationship('Member', secondary=memberworkteam_table, back_populates="workteams")
        active = db.Column(db.Boolean, nullable=False)  # whether a team is currently working events or is historical
        active_year = db.Column(db.Integer)  # Year that the workteam was or is active
        active_period = db.Column(
            db.Enum(PeriodEnum))  # Part of the year that the workteam was active, (i.e. fall/spring)

    class Member(db.Model):
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

    # Finally, return our models to the app
    return {
        'workteam': Workteam,
        'member': Member
    }
