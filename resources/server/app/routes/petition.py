from ..extensions import db, jsonify, request, create_access_token, Blueprint
from ..models.civil_registry_corrections import Petitions, PetitionSupportingDocuments, PetitionClericalErrors, PetitionActions
from ..schemas.petition_schema import PetitionSchema, PetitionActionsSchema
from ..extensions import desc


petitions = Blueprint("petitions", __name__)

# Schema Initialize
petition_schema = PetitionSchema()
petitions_list_schema = PetitionSchema(many=True)


#########
# View
#########


@petitions.route("/petitions", methods=["GET"])
def get_all_petitions():
    petitions_records = Petitions.query.order_by(desc(Petitions.created_at)).all()
    result = petitions_list_schema.dump(petitions_records)
    return jsonify(result), 200


@petitions.route("/petitions/get-petition/<int:id>", methods=["GET"])
def get_petition_by_id(id):
    petition_record = Petitions.query.get(id)

    if not petition_record:
        return jsonify({"message": "Petition not found"}), 404

    result = petition_schema.dump(petition_record)
    return jsonify(result), 200

#########
# Update
#########

@petitions.route("/petitions/edit-petition/<int:id>", methods=["PUT"])
def edit_petition(id):
    # Get the request data
    data = request.get_json()

    # Retrieve the petition record to update
    petition_record = Petitions.query.get_or_404(id)

    # Update the main petition fields from the received data
    petition_record.action_taken_date = data.get("action_taken_date", petition_record.action_taken_date)
    petition_record.administering_officer_name = data.get("administering_officer_name", petition_record.administering_officer_name)
    petition_record.administering_officer_position = data.get("administering_officer_position", petition_record.administering_officer_position)
    petition_record.amount_paid = data.get("amount_paid", petition_record.amount_paid)
    petition_record.certificate_posting_end = data.get("certificate_posting_end", petition_record.certificate_posting_end)
    petition_record.certificate_posting_start = data.get("certificate_posting_start", petition_record.certificate_posting_start)
    petition_record.created_by = data.get("created_by", petition_record.created_by)
    petition_record.date_filed = data.get("date_filed", petition_record.date_filed)
    petition_record.date_paid = data.get("date_paid", petition_record.date_paid)
    petition_record.document_owner = data.get("document_owner", petition_record.document_owner)
    petition_record.event_country = data.get("event_country", petition_record.event_country)
    petition_record.event_date = data.get("event_date", petition_record.event_date)
    petition_record.event_municipality = data.get("event_municipality", petition_record.event_municipality)
    petition_record.event_province = data.get("event_province", petition_record.event_province)
    petition_record.event_type = data.get("event_type", petition_record.event_type)
    petition_record.exhibiting_his_her = data.get("exhibiting_his_her", petition_record.exhibiting_his_her)
    petition_record.exhibiting_number = data.get("exhibiting_number", petition_record.exhibiting_number)
    petition_record.file_path = data.get("file_path", petition_record.file_path)
    petition_record.filing_city_municipality = data.get("filing_city_municipality", petition_record.filing_city_municipality)
    petition_record.filing_province = data.get("filing_province", petition_record.filing_province)
    petition_record.first_name_from = data.get("first_name_from", petition_record.first_name_from)
    petition_record.first_name_to = data.get("first_name_to", petition_record.first_name_to)
    petition_record.ground_a = data.get("ground_a", petition_record.ground_a)
    petition_record.ground_b = data.get("ground_b", petition_record.ground_b)
    petition_record.ground_b_data = data.get("ground_b_data", petition_record.ground_b_data)
    petition_record.ground_c = data.get("ground_c", petition_record.ground_c)
    petition_record.ground_d = data.get("ground_d", petition_record.ground_d)
    petition_record.ground_e = data.get("ground_e", petition_record.ground_e)
    petition_record.ground_f = data.get("ground_f", petition_record.ground_f)
    petition_record.ground_f_data = data.get("ground_f_data", petition_record.ground_f_data)
    petition_record.header_municipality = data.get("header_municipality", petition_record.header_municipality)
    petition_record.header_province = data.get("header_province", petition_record.header_province)
    petition_record.is_indigent = data.get("is_indigent", petition_record.is_indigent)
    petition_record.is_migrant = data.get("is_migrant", petition_record.is_migrant)
    petition_record.issued_at = data.get("issued_at", petition_record.issued_at)
    petition_record.issued_on = data.get("issued_on", petition_record.issued_on)
    petition_record.municipal_civil_registrar = data.get("municipal_civil_registrar", petition_record.municipal_civil_registrar)
    petition_record.nationality = data.get("nationality", petition_record.nationality)
    petition_record.notice_posting = data.get("notice_posting", petition_record.notice_posting)
    petition_record.o_r_number = data.get("o_r_number", petition_record.o_r_number)
    petition_record.petition_date_granted = data.get("petition_date_granted", petition_record.petition_date_granted)
    petition_record.petition_date_issued = data.get("petition_date_issued", petition_record.petition_date_issued)
    petition_record.petition_number = data.get("petition_number", petition_record.petition_number)
    petition_record.petition_type = data.get("petition_type", petition_record.petition_type)
    petition_record.petitioner_address = data.get("petitioner_address", petition_record.petitioner_address)
    petition_record.petitioner_error_in = data.get("petitioner_error_in", petition_record.petitioner_error_in)
    petition_record.petitioner_name = data.get("petitioner_name", petition_record.petitioner_name)
    petition_record.publication_end = data.get("publication_end", petition_record.publication_end)
    petition_record.publication_newspaper = data.get("publication_newspaper", petition_record.publication_newspaper)
    petition_record.publication_place = data.get("publication_place", petition_record.publication_place)
    petition_record.publication_start = data.get("publication_start", petition_record.publication_start)
    petition_record.registry_number = data.get("registry_number", petition_record.registry_number)
    petition_record.relation_owner = data.get("relation_owner", petition_record.relation_owner)
    petition_record.remarks = data.get("remarks", petition_record.remarks)
    petition_record.republic_act_number = data.get("republic_act_number", petition_record.republic_act_number)
    petition_record.spouse_name = data.get("spouse_name", petition_record.spouse_name)
    petition_record.status = data.get("status", petition_record.status)
    petition_record.subscribe_sworn_city_municipality = data.get("subscribe_sworn_city_municipality", petition_record.subscribe_sworn_city_municipality)
    petition_record.subscribe_sworn_date = data.get("subscribe_sworn_date", petition_record.subscribe_sworn_date)

    if "petition_actions" in data:
        for action_data in data["petition_actions"]:
            # Use the PetitionActions model to query, not the schema
            action = PetitionActions.query.get(action_data.get("id"))
            if action:
                action.action_decision = action_data.get("action_decision", action.action_decision)
                action.action_text = action_data.get("action_text", action.action_text)
                action.error_num = action_data.get("error_num", action.error_num)
            else:
                new_action = PetitionActions(
                    petition_id=petition_record.id,
                    action_decision=action_data["action_decision"],
                    action_text=action_data["action_text"],
                    error_num=action_data["error_num"]
                )
                db.session.add(new_action)
                
    if "reasons" in data:
        for reason_data in data["reasons"]:
            # Use the PetitionActions model to query, not the schema
            reason = PetitionActions.query.get(reason_data.get("id"))
            if reason:
                reason.action_decision = reason_data.get("action_decision", reason.action_decision)
                reason.action_text = reason_data.get("action_text", reason.action_text)
                reason.error_num = reason_data.get("error_num", reason.error_num)
            else:
                new_reason = PetitionActions(
                    petition_id=petition_record.id,
                    error_num=reason_data["error_num"],
                    reason=reason_data["reason"],
                )
                db.session.add(new_reason)

    # Handle clerical_errors (update or add new ones)
    if "clerical_errors" in data:
        for error_data in data["clerical_errors"]:
            error = PetitionClericalErrors.query.get(error_data.get("id"))
            if error:
                error.description = error_data.get("description", error.description)
                error.error_description_from = error_data.get("error_description_from", error.error_description_from)
                error.error_description_to = error_data.get("error_description_to", error.error_description_to)
                error.error_num = error_data.get("error_num", error.error_num)
            else:
                new_error = PetitionClericalErrors(
                    petition_id=petition_record.id,
                    description=error_data["description"],
                    error_description_from=error_data["error_description_from"],
                    error_description_to=error_data["error_description_to"],
                    error_num=error_data["error_num"]
                )
                db.session.add(new_error)

    # Handle supporting_documents (remove existing ones and add new ones)
    if "supporting_documents" in data:
        # Remove all existing supporting documents for the petition
        PetitionSupportingDocuments.query.filter_by(petition_id=petition_record.id).delete()

        # Add the new supporting documents
        for doc_data in data["supporting_documents"]:
            new_doc = PetitionSupportingDocuments(
                petition_id=petition_record.id,
                document_name=doc_data["document_name"]
            )
            db.session.add(new_doc)

        # Commit the changes to the database
        db.session.commit()


    # Commit changes to the database
    try:
        db.session.commit()
        return jsonify({"message": "Petition updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"error": "An error occurred while updating the petition."}), 500

# Get Latest Petitions
@petitions.route("/petitions/latest-cce", methods=["GET"])
def get_latest_cce_petition():
    latest_petition = (
        Petitions.query.filter_by(petition_type="CCE")
        .order_by(Petitions.created_at.desc())
        .first()
    )
    if latest_petition:
        result = {"petition_number": latest_petition.petition_number}
        return jsonify(result), 200
    else:
        return jsonify({"message": "No CCE petition found"}), 404


@petitions.route("/petitions/latest-cfn", methods=["GET"])
def get_latest_cfn_petition():
    latest_petition = (
        Petitions.query.filter_by(petition_type="CFN")
        .order_by(Petitions.created_at.desc())
        .first()
    )
    if latest_petition:
        result = {"petition_number": latest_petition.petition_number}
        return jsonify(result), 200
    else:
        return jsonify({"message": "No CFN petition found"}), 404


#########
# Additionals
#########

@petitions.route("/petitions/supporting-documents", methods=["GET"])
def get_all_supporting_documents():
    supporting_documents = (
        PetitionSupportingDocuments.query
        .with_entities(PetitionSupportingDocuments.document_name)
        .distinct()
        .all()
    )

    # Extract document names from the result
    document_names = [doc.document_name for doc in supporting_documents]

    return jsonify({"supporting_documents": document_names}), 200


@petitions.route("/petitions/clerical-errors", methods=["GET"])
def get_all_clerical_errors():
    clerical_errors = (
        PetitionClericalErrors.query
        .with_entities(PetitionClericalErrors.description)
        .distinct()
        .all()
    )

    # Extract descriptions from the result
    error_descriptions = [error.description for error in clerical_errors]

    return jsonify({"clerical_errors": error_descriptions}), 200


#########
# Insert
#########


@petitions.route("/petitions/add-petition", methods=["POST"])
def add_petition():
    data = request.get_json()

    # Validate petition_number uniqueness
    existing_petition = Petitions.query.filter_by(
        petition_number=data["petition_number"]
    ).first()
    if existing_petition:
        return jsonify({"error": "Petition number already exists"}), 400

    new_petition = petition_schema.load(data, session=db.session)
    db.session.add(new_petition)
    db.session.commit()
    result = petition_schema.dump(new_petition)
    return jsonify(result), 201


#########
# Delete
#########


@petitions.route("/petition/<int:id>", methods=["DELETE"])
def delete_petition(id):
    petition = Petitions.query.get(id)
    if petition:
        # Delete related data (optional)
        for clerical_error in petition.clerical_errors:
            db.session.delete(clerical_error)

        for supporting_document in petition.supporting_documents:
            db.session.delete(supporting_document)

        for petition_action in petition.petition_actions:
            db.session.delete(petition_action)

        for reason in petition.reasons:
            db.session.delete(reason)

        # Delete the petition itself
        db.session.delete(petition)
        db.session.commit()

        return jsonify({"message": "Petition record deleted successfully."}), 200
    else:
        return jsonify({"message": "Petition record not found."}), 404
    # return jsonify({"message": "Petition record deleted successfully."}), 200
