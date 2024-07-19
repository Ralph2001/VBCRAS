from ..extensions import (
    db,
    jsonify,
    request,
    create_access_token,
    Blueprint,
    render_template,
)

# All System Configuration API


configuration = Blueprint("configuration", __name__)


@configuration.route("/test-server", methods=["GET"])
def connect():
    # return jsonify({"status": "connected"}), 201
    return render_template("server_running.html"), 201


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
