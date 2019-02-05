# model.py
# Defines our SQLAlchemy models


import flask_sqlalchemy
import enum


db = flask_sqlalchemy.SQLAlchemy()  # see documentation in class definition from flask_sqlalchemy


# Enums for our models to use #
class PeriodEnum(enum.IntEnum):
    """ Used to define what time of the year a workteam was active, typically Spring semester or Fall Semester. """
    spring = 0
    fall = 1


class CurrentRoleEnum(enum.IntEnum):  # TMEIT roles for members
    """Used to define what role a member *currently* has. Negative numbers are non-members."""
    master = 0
    marshal = 1
    prao = 2
    vraq = 3
    ex = 4
    inactive = 5
    exprao = -1


class RoleOrTitle(enum.IntEnum):
    """Used to state the Role or Title for a RoleHistory.

    New values should be added as new roles or titles are created.

    Generic roles = 1000
    Master roles = 2000
    Official Titles = 3000
    Misc Titles = 4000
    """

    # Generic Roles #
    prao = 1000
    marskalk = 1001
    inactive = 1003
    ex = 1004
    vraq = 1005

    # Master Roles #
    TraditionsMästare = 2000
    Vice_TraditionsMästare = 2001
    SkattMästare = 2002
    PubMästare = 2003
    SkriptMästare = 2004

    # Official Titles #
    # Junk
    JunkPrao = 3000
    JunkMarskalk = 3001
    JunkMaster = 3002
    JunkVraq = 3003
    # Gourmet
    GourmetPrao = 3010
    GourmetMarskalk = 3011
    GourmetMaster = 3012
    GourmetVraq = 3013
    # Webb (the coolest title)
    WebbPrao = 3200
    WebbMarskalk = 3021
    WebbMaster = 3022
    WebbWraq = 3023
    # Helrör
    Helrör = 3030

    # Misc Titles #
    pajas = 4000
    driver = 4001
    sect = 4002
    pixel_artist = 4003
    rock_on = 4004


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
    active_year = db.Column(db.Integer)  # Year that the workteam was or is active (Purely cosmetic)
    active_period = db.Column(
        db.Enum(PeriodEnum))  # Part of the year that the workteam was active, (i.e. fall/spring, also cosmetic)


class Member(db.Model):
    """ SQL Alchemy model for TMEIT Members.

    TMEIT members are stored in the database by their email address. (Usually a KTH email, but this may be a Gmail
    address if they are not a KTH student)
    Members have a current role, which describes their current position in TMEIT and their website permissions.
    They can also can have a number of different roles and titles in the klubbmästeri.

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
        current_role: What role the member currently has in TMEIT. Defines the member's permissions on the TMEIT
            website. Stored as a string or an int that corresponds to a value in RoleEnum.
        role_histories: A list of RoleHistories for the member, describing past or current roles or titles that they
            have held, and the dates that they have held them.
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
    current_role = db.Column(db.Enum(CurrentRoleEnum), nullable=False)
    role_histories = db.relationship('RoleHistory', back_populates='owner')
    # role = db.Column(db.Enum(RoleEnum), nullable=False)
    # prao_date = db.Column(db.Date)
    # marskalk_date = db.Column(db.Date)
    # vraq_ex_date = db.Column(db.Date)
    # titles = db.Column(db.Unicode)
    workteams = db.relationship('Workteam', secondary=memberworkteam_table, back_populates="members")
    workteams_leading = db.relationship('Workteam', secondary=workteamleader_table, back_populates="team_leaders")


class RoleHistory(db.Model):
    """ SQL Alchemy model to track "Role Histories", the roles and titles of TMEIT members.

    Each Role History belongs to a TMEIT member, and it states the role or title that they had, the date that they
    recieved that role or title, and once that role or title has ended, the end date for that role or title.

    Roles and titles are listed in the Role or Title enum.


    Columns:
        owner/owner_email: The member that this RoleHistory belongs to.
        role: The role or title the member had, defined by the RoleOrTitle enum.
        start_date: The date that the member gained the role or title.
        end_date: The date that the member finished the role or title.
    """

    __tablename__ = 'role_histories'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    owner_email = db.Column(db.Integer, db.ForeignKey('members.email'))
    owner = db.relationship('Member', back_populates='role_histories')
    role = db.Column(db.Enum(RoleOrTitle), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)

