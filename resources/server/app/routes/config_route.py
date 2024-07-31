from ..extensions import (
    db,
    jsonify,
    request,
    create_access_token,
    Blueprint,
    render_template,
)

from ..schemas.system_schema import SystemSchema, ScannedTypeSchema
from ..models.system import SystemSettings
from ..models.scanned import ScannedType

# from ..models.user import Positions

# All System Configuration API
system_schema = SystemSchema()
systems_schema = SystemSchema(many=True)

scanned_schema = ScannedTypeSchema()
scans_schema = ScannedTypeSchema(many=True)

# position_schema = PositionSchema()
# positions_schema = PositionSchema(many=True)


configuration = Blueprint("configuration", __name__)


@configuration.route("/test-server", methods=["GET"])
def connect():
    # return jsonify({"status": "connected"}), 201
    return render_template("server_running.html"), 201


@configuration.route("/system-settings", methods=["POST"])
def set_system_settings():
    data = request.get_json()
    change_setting = system_schema.load(data, session=db.session)

    db.session.add(change_setting)
    db.session.commit()

    result = system_schema.dump(change_setting)
    return jsonify(result), 201


# Get System Settings


@configuration.route("/system-settings", methods=["GET"])
def get_system_settings():
    system_setting = SystemSettings.query.all()
    result = systems_schema.dump(system_setting)
    return jsonify(result), 200


# Add Scanned Types

@configuration.route("/get-scanned-type", methods=["GET"])
def get_scanned_type():
    scanned_types = ScannedType.query.all()
    result = scans_schema.dump(scanned_types)
    return jsonify(result), 200

@configuration.route("/add-scanned-type", methods=["POST"])
def add_scanned_type():
    data = request.get_json()
    add_scanned_type = scanned_schema.load(data, session=db.session)
    
    db.session.add(add_scanned_type)
    db.session.commit()

    result = scanned_schema.dump(add_scanned_type)
    return jsonify(result), 201


# User Positions
# @configuration.route("/get-positions", methods=["GET"])
# def get_positions():
#     positions = Positions.query.all()
#     result = positions_schema.dump(positions)
#     return jsonify(result), 200

# @configuration.route("/add-positions", methods=["POST"])
# def add_positions():
#     data = request.get_json()
#     print(data)
#     add_position = position_schema.load(data, session=db.session)

#     db.session.add(add_position)
#     db.session.commit()

#     result = position_schema.dump(add_position)
#     return jsonify(result), 201


#########
# View
#########


#########
# Insert
#########


#########
# Edit
#########


#########
# Delete
#########
