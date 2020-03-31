# endpoints.py
# Defines the JSON format of our database objects when sent out over the internet,
# and provides the endpoint blueprints for Flask

import flask
import flask_marshmallow
import jwt.exceptions
import marshmallow.fields
from marshmallow_enum import EnumField
from marshmallow_sqlalchemy.fields import Nested

from tmeit_backend import models, auth, utils


# JSON serializers and deserializers
ma = flask_marshmallow.Marshmallow()

# TODO: make HyperLinkRelated fields absolute
# TODO: Input sanitation/validation


class RoleHistorySchema(ma.ModelSchema):
    class Meta:
        model = models.RoleHistory
    role = EnumField(models.RoleOrTitle)


class MemberSchema(ma.ModelSchema):
    class Meta:
        model = models.Member
        exclude = ['password_hash']
    workteams = marshmallow.fields.List(ma.HyperlinkRelated('model_endpoints.workteam_detail'))
    workteams_leading = marshmallow.fields.List(ma.HyperlinkRelated('model_endpoints.workteam_detail'))
    current_role = EnumField(models.CurrentRoleEnum)
    role_histories = Nested(RoleHistorySchema, many=True)


class WorkteamSchema(ma.ModelSchema):
    class Meta:
        model = models.Workteam
    members = marshmallow.fields.List(ma.HyperlinkRelated('model_endpoints.member_detail'))
    team_leaders = marshmallow.fields.List(ma.HyperlinkRelated('model_endpoints.member_detail'))
    active_period = EnumField(models.PeriodEnum)

# TODO: Hide some information about members when not authenticated using arguments to Schema() init


# Endpoints
model_endpoints = flask.Blueprint('model_endpoints', __name__)


@model_endpoints.route('/api/members/')
@utils.json_required
def members():
    all_members = models.Member.query.all()
    return MemberSchema(many=True).jsonify(all_members)


@model_endpoints.route('/api/members/<id>', methods=['GET', 'POST'])
@utils.json_required
def member_detail(id):
    member: models.Member = models.Member.query.get(id)
    if flask.request.method == 'POST':
        post(instance=member, schema=MemberSchema())
    return MemberSchema().jsonify(member)


@model_endpoints.route('/api/workteams/')
@utils.json_required
def workteams():
    all_workteams = models.Workteam.query.all()
    return WorkteamSchema().jsonify(all_workteams)


@model_endpoints.route('/api/workteams/<id>')
@utils.json_required
def workteam_detail(id):
    workteam: models.Workteam = models.Workteam.query.get(id)
    return WorkteamSchema(many=True).jsonify(workteam)


def post(instance, schema):
    """Special universal function used to authenticate and handle post request on schemas."""

    data = flask.request.json

    # Force authentication
    try:
        user = auth.verify_token(data.get('auth'))
        del data['auth']  # Delete auth token from input so it doesn't go into our model instance
    except jwt.exceptions.InvalidTokenError:
        flask.abort(403, "You must be logged in to perform this action.")
        return

    # Figure out what fields the current user is allowed to modify
    try:
        if user.current_role == models.CurrentRoleEnum.master:
            acl = instance.allowed_master_fields
        elif user == instance:
            acl = instance.allowed_user_fields  # Special list for user editing themselves
        elif user.current_role > 0:  # must be a member to use POST
            acl = instance.allowed_member_fields
        else: 
            acl = []
    except NameError:
        raise NameError(f'{instance} is missing POSTable fields!')
    for field in flask.request.json:
        if field not in acl:
            flask.abort(403, f'You are not allowed to change the "{field}" field on {instance}.')
            return

    # Deserialize json into model and commit changes
    schema.load(flask.request.json, instance=instance, partial=True)
    models.db.session.commit()

# def post_event(instance, schema):
#     """Function for authenticating and handling post requests for events"""
#     if isinstance(instance, models.TmeitEvent) and False:  # user in models.Member.query().options:
#     acl = []  # Special list for workteams working TmeitEvents

# @authorization(get=,post=

# get:
# check input format
# check master permissions
# check member permissions
# check custom relational permissions
# execute

# post:
# check input format
# check master permissions
# check member permissions
# check custom relational permissions
# execute

# queryset
# serializer (uninstanciated?)
# additional auth grant