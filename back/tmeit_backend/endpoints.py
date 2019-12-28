# endpoints.py
# Defines the JSON format of our database objects when sent out over the internet,
# and provides the endpoint blueprints for Flask

import flask
import flask_marshmallow
import jwt.exceptions
import marshmallow.fields
from marshmallow_enum import EnumField
from marshmallow_sqlalchemy.fields import Nested

from tmeit_backend import models, auth


# TODO: make HyperLinkRelated fields absolute
def generate_endpoints(app):

    # Initialize flask_marshmallow and a Flask blueprint
    ma = flask_marshmallow.Marshmallow(app)
    model_endpoints = flask.Blueprint('model_endpoints', __name__)

    # Schemas
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
        #TODO: Add RoleHistory nesting?

    class WorkteamSchema(ma.ModelSchema):
        class Meta:
            model = models.Workteam
        members = marshmallow.fields.List(ma.HyperlinkRelated('model_endpoints.member_detail'))
        team_leaders = marshmallow.fields.List(ma.HyperlinkRelated('model_endpoints.member_detail'))
        active_period = EnumField(models.PeriodEnum)

    # Schema instances
    member_schema = MemberSchema()
    members_schema = MemberSchema(many=True)
    workteam_schema = WorkteamSchema()
    workteams_schema = WorkteamSchema(many=True)
    # TODO: Hide some information about members when not authenticated

    # Endpoints
    @model_endpoints.route('/api/members/')
    def members():
        all_members = models.Member.query.all()
        return flask.jsonify(members_schema.dump(all_members))

    @model_endpoints.route('/api/members/<id>', methods=['GET', 'POST'])
    def member_detail(id):
        member: models.Member = models.Member.query.get(id)
        if flask.request.method == 'POST':
            post(instance=member, schema=member_schema)
        return flask.jsonify(member_schema.dump(member))

    @model_endpoints.route('/api/workteams/')
    def workteams():
        all_workteams = models.Workteam.query.all()
        return flask.jsonify(workteams_schema.dump(all_workteams))

    @model_endpoints.route('/api/workteams/<id>')
    def workteam_detail(id):
        workteam: models.Workteam = models.Workteam.query.get(id)
        return flask.jsonify(workteam_schema.dump(workteam))

    # end
    return model_endpoints


def post(instance, schema):
    """Special universal function used to handle post request on schemas."""

    # Require a JSON body with POST
    if not flask.request.is_json:
        flask.abort(400)
        return

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
        else:
            acl = instance.allowed_member_fields
    except NameError:
        raise NameError(f'{instance} is missing POSTable fields!')
    for field in flask.request.json:
        if field not in acl:
            flask.abort(403, f'You are not allowed to change the "{field}" field on {instance}.')
            return

    # Deserialize json into model and commit changes
    schema.load(flask.request.json, instance=instance, partial=True)
    models.db.session.commit()
