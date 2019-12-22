# endpoints.py
# Defines the JSON format of our database objects when sent out over the internet,
# and provides the endpoint blueprints for Flask

import flask
from sqlalchemy.orm import joinedload
import flask_marshmallow
from marshmallow_enum import EnumField

from tmeit_backend import models


def generate_endpoints(app):

    # Initialize flask_marshmallow and a Flask blueprint
    ma = flask_marshmallow.Marshmallow(app)
    model_endpoints = flask.Blueprint('model_endpoints', __name__)

    # Schemas
    class MemberSchema(ma.ModelSchema):
        class Meta:
            model = models.Member
        workteams = ma.List(ma.HyperlinkRelated('model_endpoints.workteam_detail'))
        workteams_leading = ma.List(ma.HyperlinkRelated('model_endpoints.workteam_detail'))

    class WorkteamSchema(ma.ModelSchema):
        class Meta:
            model = models.Workteam

        members = ma.List(ma.HyperlinkRelated('model_endpoints.member_detail', url_key='email'))
        team_leaders = ma.List(ma.HyperlinkRelated('model_endpoints.member_detail', url_key='email'))
        active_period = EnumField(models.PeriodEnum)

    # Schema instances
    member_schema = MemberSchema()
    members_schema = MemberSchema(many=True)
    workteam_schema = WorkteamSchema()
    workteams_schema = WorkteamSchema(many=True)

    # Endpoints
    @model_endpoints.route('/api/members/')
    def members():
        all_members = models.Member.query.all()
        return flask.jsonify(members_schema.dump(all_members))

    @model_endpoints.route('/api/members/<email>')
    def member_detail(email):
        member = models.Member.query.get(email)
        return flask.jsonify(member_schema.dump(member))

    @model_endpoints.route('/api/workteams/')
    def workteams():
        all_workteams = models.Workteam.query.all()
        return flask.jsonify(workteams_schema.dump(all_workteams))

    @model_endpoints.route('/api/workteams/<id>')
    def workteam_detail(id):
        workteam = models.Workteam.query.get(id)
        return flask.jsonify(workteam_schema.dump(workteam))

    # end
    return model_endpoints
