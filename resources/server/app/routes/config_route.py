from ..extensions import (
    db,
    jsonify,
    request,
    create_access_token,
    Blueprint,
    render_template,
)

from ..schemas.system_schema import (
    SystemSchema,
    ScannedTypeSchema,
    DateRuleSchema,
    HolidaySchema,
)

from ..models.system import SystemSettings, DateRules, Holidays
from ..models.scanned import ScannedType


# from ..models.user import Positions

# All System Configuration API
system_schema = SystemSchema()
systems_schema = SystemSchema(many=True)

scanned_schema = ScannedTypeSchema()
scans_schema = ScannedTypeSchema(many=True)

date_rule_schema = DateRuleSchema()
date_rule_schemas = DateRuleSchema(many=True)

holiday_schema = HolidaySchema()
holidays_schema = HolidaySchema(many=True)

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


# Date Rules
@configuration.route("/add-date-rules", methods=["POST"])
def add_date_rules():
    data = request.get_json()
    date_rule = date_rule_schema.load(data, session=db.session)

    db.session.add(date_rule)
    db.session.commit()

    result = date_rule_schema.dump(date_rule)
    return jsonify(result), 201


@configuration.route("/get-date-rules", methods=["GET"])
def get_date_rules():
    date_rules = DateRules.query.all()
    result = scans_schema.dump(date_rules)
    return jsonify(result), 200


# Holidays
@configuration.route("/add-holiday", methods=["POST"])
def add_holiday():
    data = request.get_json()
    holiday = holiday_schema.load(data, session=db.session)

    db.session.add(holiday)
    db.session.commit()

    result = holiday_schema.dump(holiday)
    return jsonify(result), 201


@configuration.route("/get-holidays", methods=["GET"])
def get_holidays():
    holidays = Holidays.query.all()
    result = holidays_schema.dump(holidays)
    return jsonify(result), 200


@configuration.route("/remove-holiday/<int:id>", methods=["DELETE"])
def remove_holidays(id):
    holidays = Holidays.query.get(id)
    # Delete the  holidays
    db.session.delete(holidays)
    db.session.commit()

    return jsonify({"message": "Holiday record deleted successfully."}), 200

    # return jsonify({"message": "Petition record deleted successfully."}), 200


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
