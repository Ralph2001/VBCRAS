

from ..extensions import db, jsonify, request, create_access_token, Blueprint
from ..models.user import Users


user = Blueprint("user", __name__)


# Sign up Route
@user.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    required_fields = ["username", "password", "role"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"'{field}' is required"}), 400

    existing_user = Users.query.filter_by(username=data["username"]).first()
    if existing_user:
        return jsonify({"error": "Username already exists"}), 409

    new_user = Users(
        username=data["username"],
        role=data["role"],
        position=data["position_id"],
    )
    new_user.set_password(data["password"])

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"status": "success"}), 201


# Login Route


@user.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    user = Users.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(
        identity={"username": user.username, "role": user.role}
    )
    return jsonify(access_token=access_token), 200
