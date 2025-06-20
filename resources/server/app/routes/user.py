from ..extensions import (
    db,
    jsonify,
    request,
    create_access_token,
    Blueprint,
    jwt_required,
    get_jwt_identity,
)
from ..models.user import Users

from ..schemas.user_schema import UserSchema

# Schema Initialize
user_schema = UserSchema()
users_list_schema = UserSchema(many=True)


user = Blueprint("user", __name__)


# Sign up Route
@user.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    required_fields = ["username", "password"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"'{field}' is required"}), 400

    existing_user = Users.query.filter_by(username=data["username"]).first()
    if existing_user:
        return jsonify({"error": "Username already exists"}), 409

    new_user = Users(
        username=data["username"],
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

    access_token = create_access_token(identity=str(user.id))  # Convert user.id to string
    return jsonify(access_token=access_token), 200



@user.route("/user", methods=["GET"])
@jwt_required()
def get_user():
    current_user = get_jwt_identity()
    print(current_user)
    user_record = Users.query.get_or_404(current_user)
    result = user_schema.dump(user_record)
    return jsonify(result), 200


@user.route("/validate-password", methods=["POST"])
@jwt_required()
def validate_password():
    data = request.get_json()
    password = data.get("password")

    if not password:
        return jsonify({"error": "Password is required"}), 400

    current_user_id = get_jwt_identity()
    user = Users.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    is_valid = user.check_password(password)
    return jsonify({"valid": is_valid}), 200

