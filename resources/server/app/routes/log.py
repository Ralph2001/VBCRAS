from ..extensions import db, jsonify, request, Blueprint, get_jwt_identity, jwt_required, SQLAlchemyError
from ..models.logs import ActivityLog
from ..models.user import Users
from ..schemas.activity_schema import ActivityLogSchema
from ..extensions import desc


activity_bp = Blueprint("activity_logs", __name__)

# Schema Initialize
activity_log_schema = ActivityLogSchema()
activity_log_list_schema= ActivityLogSchema(many=True)


def get_current_user():
    user_id = get_jwt_identity()
    return Users.query.get(user_id)


# ✅ Create Activity Log
@activity_bp.route('/logs', methods=['POST'])
@jwt_required()
def create_log():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized user."}), 401

    data = request.get_json()
    required_fields = ['action', 'module', 'status']
    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        new_log = ActivityLog(
            created_by=user.id,
            action=data['action'],
            module=data['module'],
            details=data.get('details', ''),
            status=data['status']
        )
        db.session.add(new_log)
        db.session.commit()
        return activity_log_schema.jsonify(new_log), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# ✅ Get All Logs (with pagination, filters)
@activity_bp.route('/logs', methods=['GET'])
@jwt_required()
def get_logs():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    action = request.args.get('action')
    module = request.args.get('module')

    query = ActivityLog.query

    if action:
        query = query.filter_by(action=action)
    if module:
        query = query.filter_by(module=module)

    query = query.order_by(desc(ActivityLog.timestamp))
    paginated = query.paginate(page=page, per_page=limit, error_out=False)

    return jsonify({
        "items": activity_log_list_schema.dump(paginated.items),
        "total": paginated.total,
        "pages": paginated.pages,
        "current_page": paginated.page
    })


# ✅ Get Single Log
@activity_bp.route('/logs/<int:log_id>', methods=['GET'])
@jwt_required()
def get_log(log_id):
    log = ActivityLog.query.get_or_404(log_id)
    return activity_log_schema.jsonify(log)


# ✅ Update Log
@activity_bp.route('/logs/<int:log_id>', methods=['PUT'])
@jwt_required()
def update_log(log_id):
    log = ActivityLog.query.get_or_404(log_id)
    data = request.get_json()

    try:
        log.action = data.get('action', log.action)
        log.module = data.get('module', log.module)
        log.details = data.get('details', log.details)
        log.status = data.get('status', log.status)

        db.session.commit()
        return activity_log_schema.jsonify(log)
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# ✅ Delete Log
@activity_bp.route('/logs/<int:log_id>', methods=['DELETE'])
@jwt_required()
def delete_log(log_id):
    log = ActivityLog.query.get_or_404(log_id)
    try:
        db.session.delete(log)
        db.session.commit()
        return jsonify({"message": "Activity log deleted."}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400