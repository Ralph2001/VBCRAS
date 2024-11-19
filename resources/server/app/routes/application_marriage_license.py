from ..extensions import db, jsonify, request, create_access_token, Blueprint
from ..models.application_marriage_license import ApplicationMarriageLicense
from ..schemas.application_marriage_license_schema import ApplicationMarriageLicenseSchema


application_marriage_license = Blueprint("application_marriage_license", __name__)

# Schema Initialize
application_mariage_license_schema = ApplicationMarriageLicenseSchema()
application_mariage_license_list_schema = ApplicationMarriageLicenseSchema(many=True)


#########
# View
#########


@application_marriage_license.route("/application-marriage-license", methods=["GET"])
def get_all_application_marriage_license():
    application_marriage_license_records = ApplicationMarriageLicense.query.all()
    result = application_mariage_license_list_schema.dump(application_marriage_license_records)
    return jsonify(result), 200


#########
# Insert
#########


@application_marriage_license.route("/application-marriage-license", methods=["POST"])
def add_application_marriage_license():
    data = request.get_json()
    new_application_marriage_license = application_mariage_license_schema.load(data, session=db.session)

    db.session.add(new_application_marriage_license)
    db.session.commit()

    result = application_mariage_license_schema.dump(new_application_marriage_license)
    return jsonify(result), 201


#########
# Edit
#########


@application_marriage_license.route("/application-marriage-license/<int:id>", methods=["GET"])
def get_application_marriage_license(id):
    application_marriage_license_record = ApplicationMarriageLicense.query.get_or_404(id)
    result = application_mariage_license_schema.dump(application_marriage_license_record)
    return jsonify(result), 200


#########
# Delete
#########

@application_marriage_license.route("/application-marriage-license/<int:id>", methods=["DELETE"])
def delete_application_marriage_license(id):
    application_marriage_license_record = ApplicationMarriageLicense.query.get_or_404(id)
    db.session.delete(application_marriage_license_record)
    db.session.commit()
    return jsonify({"message": "Application Marriage License record deleted successfully."}), 200
