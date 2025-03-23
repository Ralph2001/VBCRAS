from ..extensions import db, jsonify, request, create_access_token, Blueprint
from ..models.scanned import Scans
from ..schemas.scanned_schema import ScanListSchema, ScanDetailSchema
from ..models.scanned import ScannedType

scans = Blueprint("scans", __name__)

# Schema Initialize
scan_schema = ScanListSchema()
scans_list_schema = ScanListSchema(many=True)


#########
# View
#########

@scans.route("/scanned", methods=["GET"])
def get_filtered_scanned():
    query = Scans.query

    # Get filters from query parameters
    type_filter = request.args.get('type')
    year_filter = request.args.get('year', type=int)
    month_filter = request.args.get('month')
    search_filter = request.args.get('SearchQuery')

    if type_filter:
        query = query.filter(Scans.type_id == type_filter)
    if year_filter:
        query = query.filter(Scans.year == year_filter)
    if month_filter:
        query = query.filter(Scans.month == month_filter)
    if search_filter:
            search_term = f"%{search_filter}%"
            query = query.filter(
                (Scans.name.ilike(search_term)) |
                (ScannedType.name.ilike(search_term)) |
                (Scans.year.ilike(search_term)) |
                (Scans.month.ilike(search_term))
            )


    # Retrieve all matching records
    scanned_records = query.all()
    result = scans_list_schema.dump(scanned_records)
    return jsonify(result), 200

# Detail endpoint - includes filepath
@scans.route("/scanned/<int:scan_id>", methods=["GET"])
def get_scan_detail(scan_id):
    scan = Scans.query.get_or_404(scan_id)
    
    # Add authorization check here (example):
    # if not current_user.can_access(scan):
    #     return jsonify({"error": "Unauthorized"}), 403
    
    result = ScanDetailSchema().dump(scan)
    return jsonify(result), 200


@scans.route("/scanned", methods=["POST"])
def add_scanned_document():
    data = request.get_json()
    # Validate and deserialize input
    add_scanned_documents = scans_list_schema.load(data, session=db.session)

    # Add each document to the database
    for scanned_document in add_scanned_documents:
        db.session.add(scanned_document)
    
    db.session.commit()

    result = scans_list_schema.dump(add_scanned_documents)
    return jsonify(result), 201


#########
# Insert
#########


# @scans.route("/ausf", methods=["POST"])
# def add_ausf():
#     data = request.get_json()
#     new_ausf = ausf_schema.load(data, session=db.session)

#     db.session.add(new_ausf)
#     db.session.commit()

#     result = ausf_schema.dump(new_ausf)
#     return jsonify(result), 201


#########
# Edit
#########


# @scans.route("/ausf/<int:id>", methods=["GET"])
# def get_ausf(id):
#     ausf_record = Ausf.query.get_or_404(id)
#     result = ausf_schema.dump(ausf_record)
#     return jsonify(result), 200


#########
# Delete
#########


# @scans.route("/ausf/<int:id>", methods=["DELETE"])
# def delete_ausf(id):
#     ausf_record = Ausf.query.get_or_404(id)
#     db.session.delete(ausf_record)
#     db.session.commit()
#     return jsonify({"message": "Ausf record deleted successfully."}), 200
