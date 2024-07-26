from ..extensions import (
    db,
    jsonify,
    request,
    create_access_token,
    Blueprint,
    render_template,
)

from ..schemas.system_schema import SystemSchema
from ..models.system import SystemSettings

# All System Configuration API
system_schema = SystemSchema()
systems_schema = SystemSchema(many=True)

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
