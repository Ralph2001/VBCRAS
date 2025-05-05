from ..extensions import db, jsonify, request, create_access_token, Blueprint
from ..models.application_marriage_license import ApplicationMarriageLicense
from ..schemas.application_marriage_license_schema import ApplicationMarriageLicenseSchema
from marshmallow import ValidationError


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
# Update
#########


@application_marriage_license.route("/application-marriage-license/<int:id>", methods=["PUT"])
def update_application_marriage_license(id):
    record = ApplicationMarriageLicense.query.get_or_404(id)

    try:
        data = request.get_json()

        # Optional: validate data but don't load as instance
        schema = ApplicationMarriageLicenseSchema(partial=True)
        schema.load(data)  # only for validation

        for key, value in data.items():
            setattr(record, key, value)

        db.session.commit()

        return jsonify({"message": "Record updated successfully"}), 200

    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500




#########
# Delete
#########

@application_marriage_license.route("/application-marriage-license/<int:id>", methods=["DELETE"])
def delete_application_marriage_license(id):
    application_marriage_license_record = ApplicationMarriageLicense.query.get_or_404(id)
    db.session.delete(application_marriage_license_record)
    db.session.commit()
    return jsonify({"message": "Application Marriage License record deleted successfully."}), 200
