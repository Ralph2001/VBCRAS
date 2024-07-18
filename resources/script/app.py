from datetime import timedelta

from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy import Column, DateTime, func
from sqlalchemy import desc
from sqlalchemy.orm import class_mapper
from werkzeug.exceptions import NotFound

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import current_user
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from werkzeug.exceptions import BadRequest
from werkzeug.security import generate_password_hash, check_password_hash
import signal


app = Flask(__name__)


def handle_sigterm(sig, frame):
    print("Received SIGTERM, shutting down Flask server...")
    exit(0)


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///local.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)
app.config["JWT_SECRET_KEY"] = "created_by_villanuevaralph2001@gmail.com"
allowed_user_agent = "vbcras"


jwt = JWTManager(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)


class ScannedDocuments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    filepath = db.Column(db.String, nullable=False)
    type = db.Column(db.String, nullable=False)
    month = db.Column(db.String, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    uploaded_by = db.Column(db.String, nullable=False)
    device_used = db.Column(db.String, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class RestoreDocuments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    filepath = db.Column(db.String, nullable=False)
    month = db.Column(db.String, nullable=False)
    year = db.Column(db.String, nullable=False)
    type = db.Column(db.String, nullable=False)
    device_used = db.Column(db.String, nullable=False)
    deleted_by = db.Column(db.String, nullable=False)
    device_used_to_delete = db.Column(db.String, nullable=False)
    deleted_at = Column(DateTime, default=func.now())


class DocumentsLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    action = db.Column(db.String, nullable=False)
    action_by = db.Column(db.String, nullable=False)
    device_used = db.Column(db.String, nullable=False)
    action_at = Column(DateTime, default=func.now())


class Petitions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String)
    document_type = db.Column(db.String)
    petition_number = db.Column(db.String)
    petitioner_name = db.Column(db.String)
    nationality = db.Column(db.String)
    petitioner_address = db.Column(db.String)
    cce_in = db.Column(db.String)
    name_owner = db.Column(db.String)
    relation_owner = db.Column(db.String)
    date_of = db.Column(db.String)
    at_city = db.Column(db.String)
    at_province = db.Column(db.String)
    at_country = db.Column(db.String)
    registry_number = db.Column(db.String)
    reason = db.Column(db.String)
    LCRO_city = db.Column(db.String)
    LCRO_province = db.Column(db.String)
    administering_officer = db.Column(db.String)
    administering_position = db.Column(db.String)
    SwornDate = db.Column(db.String)
    SwornCity = db.Column(db.String)
    Ctc = db.Column(db.String)
    CtcIssuedOn = db.Column(db.String)
    CtcIssuedAt = db.Column(db.String)
    action = db.Column(db.String)
    ActionDate = db.Column(db.String)
    mcr = db.Column(db.String)
    decision = db.Column(db.String)
    or_number = db.Column(db.String)
    amount_paid = db.Column(db.String)
    DatePaid = db.Column(db.String)
    notice_posting = db.Column(db.String)
    certificate_posting_start = db.Column(db.String)
    certificate_posting_end = db.Column(db.String)
    date_issued = db.Column(db.String)
    date_granted = db.Column(db.String)
    filepath = db.Column(db.String)


class PetitionErrors(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    petition_id = db.Column(db.Integer)
    description = db.Column(db.Integer)
    ErrorFrom = db.Column(db.Integer)
    to = db.Column(db.Integer)


class PetitionSupportDocument(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    petition_id = db.Column(db.Integer)
    document = db.Column(db.Integer)


class RecordData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String, nullable=False)
    registry_number = db.Column(db.String, nullable=False)
    document_owner = db.Column(db.String, nullable=False)
    document_spouse = db.Column(db.String, nullable=True)
    date_of = db.Column(db.String, nullable=False)
    date_of_registration = db.Column(db.String, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


# Forms

class Forms(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String, nullable=False)
    date_filed = db.Column(db.String, nullable=False)
    page_number = db.Column(db.String, nullable=False)
    book_number = db.Column(db.String, nullable=False)
    registry_number = db.Column(db.String, nullable=False)
    date_registration = db.Column(db.String, nullable=False)
    issued_to = db.Column(db.String, nullable=False)
    mcr = db.Column(db.String, nullable=False)
    verified_by = db.Column(db.String, nullable=False)
    amount_paid = db.Column(db.String, nullable=False)
    o_r_number = db.Column(db.String, nullable=False)
    date_paid = db.Column(db.String, nullable=False)
    isAuthenticated = db.Column(db.String, nullable=False)
    
class BirthAvailable(db.Model):
     id = db.Column(db.Integer, primary_key=True)
     name_child = db.Column(db.String, nullable=False)
     sex = db.Column(db.String, nullable=False)
     date_birth = db.Column(db.String, nullable=False)
     place_birth = db.Column(db.String, nullable=False)
     name_mother = db.Column(db.String, nullable=False)
     citizenship_mother = db.Column(db.String, nullable=False)
     name_father = db.Column(db.String, nullable=False)
     citizenship_father = db.Column(db.String, nullable=False)
     date_marriage_parents = db.Column(db.String, nullable=False)
     place_marriage_parents = db.Column(db.String, nullable=False)
     remarks = db.Column(db.String, nullable=False)
     form_id = db.Column(db.Integer, db.ForeignKey('forms.id'), nullable=False)

    
     
class DeathAvailable(db.Model):
     id = db.Column(db.Integer, primary_key=True)
     name_deceased = db.Column(db.String, nullable=False)
     sex = db.Column(db.String, nullable=False)
     age = db.Column(db.String, nullable=False)
     civil_status = db.Column(db.String, nullable=False)
     cititezenship = db.Column(db.String, nullable=False)
     date_death = db.Column(db.String, nullable=False)
     place_death= db.Column(db.String, nullable=False)
     cause_death = db.Column(db.String, nullable=False)
     form_id = db.Column(db.Integer, db.ForeignKey('forms.id'), nullable=False)

     
class MarriageAvailable(db.Model):
     id = db.Column(db.Integer, primary_key=True)
     name_husband = db.Column(db.String, nullable=False)
     name_wife = db.Column(db.String, nullable=False)
     date_birth_husband = db.Column(db.String, nullable=False)
     date_birth_wife = db.Column(db.String, nullable=False)
     age_husband = db.Column(db.String, nullable=False)
     age_wife = db.Column(db.String, nullable=False)
     citizenship_husband = db.Column(db.String, nullable=False)
     citizenshiP_wife = db.Column(db.String, nullable=False)
     civil_status_husband = db.Column(db.String, nullable=False)
     civil_status_wife = db.Column(db.String, nullable=False)
     husband_mother = db.Column(db.String, nullable=False)
     wife_mother = db.Column(db.String, nullable=False)
     husband_father = db.Column(db.String, nullable=False)
     wife_father = db.Column(db.String, nullable=False)
     form_id = db.Column(db.Integer, db.ForeignKey('forms.id'), nullable=False)

    
class AUSF(db.Model):
     id = db.Column(db.Integer, primary_key=True)
     registry_number = db.Column(db.String, nullable=False)
     date_registration = db.Column(db.String, nullable=False)
     affiant_name = db.Column(db.String, nullable=False)
     citizenship = db.Column(db.String, nullable=False)
     age = db.Column(db.String, nullable=False)
     address = db.Column(db.String, nullable=False)
     surname = db.Column(db.String, nullable=False)
     in_my_the = db.Column(db.String, nullable=False)
     child_name = db.Column(db.String, nullable=False)
     relation = db.Column(db.String, nullable=False)
     date_birth = db.Column(db.String, nullable=False)
     at_municipality = db.Column(db.String, nullable=False)
     at_province = db.Column(db.String, nullable=False)
     at_country = db.Column(db.String, nullable=False)
     lcro_at = db.Column(db.String, nullable=False)
     day_signature = db.Column(db.String, nullable=False)
     month_signature = db.Column(db.String, nullable=False)
     sworn_day = db.Column(db.String, nullable=False)
     sworn_month = db.Column(db.String, nullable=False)
     sworn_at = db.Column(db.String, nullable=False)
     exhibiting = db.Column(db.String, nullable=False)
     exhibiting_number= db.Column(db.String, nullable=False)
     exhibiting_at = db.Column(db.String, nullable=False)
     exhibiting_on = db.Column(db.String, nullable=False)
    # If Applicable
     ap_phi_registry_number = db.Column(db.String, nullable=False)
     ap_phi_date_registration = db.Column(db.String, nullable=False)
     pfsp_of = db.Column(db.String, nullable=False)
     
     
     

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(400), unique=True, nullable=False)
    position = db.Column(db.String(400), nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    permissions = db.relationship("UserPermissions", backref="user", lazy="dynamic")

    def set_password(self, password):
        self.password_hash = generate_password_hash(
            password
        )  

    def check_password(self, password):
        return check_password_hash(
            self.password_hash, password
        ) 

class UserPermissions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    scanned = db.Column(db.Boolean, default=True)
    scanned_view = db.Column(db.Boolean, default=True)
    scanned_add = db.Column(db.Boolean, default=False)
    scanned_delete = db.Column(db.Boolean, default=False)


class AdminCreated(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created = db.Column(db.Boolean, default=False, unique=True)


def create_admin_user():
    if not AdminCreated.query.first():
        admin = User(
            username="admin",
            position="Admin",
            is_admin=True,
            permissions=[
                UserPermissions(
                    scanned=True,
                    scanned_view=True,
                    scanned_add=True,
                    scanned_delete=True,
                ),
            ],
        )

        admin.set_password("admin")

        db.session.add(admin)
        db.session.add(AdminCreated(created=True))
        db.session.commit()


with app.app_context():
    db.create_all()
    create_admin_user()


@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()


def check_authorization(request):
    if allowed_user_agent not in request.headers.get("User-Agent"):
        abort(404)


@app.before_request
def before_request():
    check_authorization(request)


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not "username" in data or not "password" in data:
        return jsonify({"error": "Invalid request"}), 400

    user = User.query.filter_by(username=data["username"]).first()
    if user and user.check_password(data["password"]):
        token = create_access_token(identity=user)
        return jsonify({"token": token}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401


@app.route("/connect", methods=["GET"])
def connect():
    return jsonify({"status": "connected"}), 201


@app.route("/user", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    user = db.session.execute(
        db.select(User)
        .join(UserPermissions, User.id == UserPermissions.user_id)
        .where(User.id == current_user)
    ).scalar_one()

    serialize = {
        "username": user.username,
        "is_admin": user.is_admin,
        "permissions": {
            "scanned": user.permissions[0].scanned,
            "scanned_add": user.permissions[0].scanned_add,
            "scanned_view": user.permissions[0].scanned_view,
            "scanned_delete": user.permissions[0].scanned_delete,
        },
    }

    return jsonify(serialize)


@app.route("/users", methods=["GET", "POST"])
@jwt_required()
def users():

    users = db.session.execute(
        db.select(User)
        .join(UserPermissions, User.id == UserPermissions.user_id)
        .where(User.is_admin == False)
    )
    users_list = []

    for user in users:
        data = {
            "id": user.User.id,
            "name": user.User.username,
            "position": user.User.position,
            "permission": {
                "scanned": user.User.permissions[0].scanned,
                "scanned": user.User.permissions[0].scanned,
                "scanned_add": user.User.permissions[0].scanned_add,
                "scanned_view": user.User.permissions[0].scanned_view,
                "scanned_delete": user.User.permissions[0].scanned_delete,
            },
        }
        users_list.append(data)

    return jsonify(
        {
            "users": users_list,
        }
    )


@app.route("/user/select/<int:id>", methods=["GET"])
@jwt_required()
def select_user(id):

    user = db.session.execute(
        db.select(User)
        .join(UserPermissions, User.id == UserPermissions.user_id)
        .where(User.id == id)
    ).scalar_one()

    user_data = {
        "id": user.id,
        "name": user.username,
        "position": user.position,
        "permission": {
            "scanned": user.permissions[0].scanned,
            "scanned": user.permissions[0].scanned,
            "scanned_add": user.permissions[0].scanned_add,
            "scanned_view": user.permissions[0].scanned_view,
            "scanned_delete": user.permissions[0].scanned_delete,
        },
    }

    return jsonify(
        {
            "user_data": user_data,
        }
    )


@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    if not data or not all(
        field in data for field in ["username", "password", "position"]
    ):
        return (
            jsonify(
                {"error": "Missing required fields: username, password, and position"}
            ),
            400,
        )

    existing_user = User.query.filter_by(username=data["username"]).first()
    if existing_user:
        return jsonify({"error": "Username already exists"}), 409

    new_user = User(
        username=data["username"],
        position=data["position"],
        permissions=[
            UserPermissions(scanned=True),
        ],
    )
    new_user.set_password(data["password"])

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:

        return jsonify({"error": "Database integrity error: " + str(e)}), 409

    return jsonify({"status": "success"}), 201


# Record Data
@app.route("/records", methods=["GET", "POST"])
@jwt_required()
def records():
    records = db.session.execute(
        db.select(RecordData).order_by(desc(RecordData.id))
    ).scalars()
    record_data = []
    for record in records:
        mapped_record = {
            column.key: getattr(record, column.key)
            for column in class_mapper(RecordData).columns
        }
        record_data.append(mapped_record)

    return jsonify(
        {
            "message": "success",
            "record_data": record_data,
        }
    )


@app.route("/records/add", methods=["POST"])
@jwt_required()
def add_records():
    try:
        data = request.get_json()
        records = RecordData(
            type=data["type"],
            registry_number=data["registry_number"],
            document_owner=data["document_owner"],
            document_spouse=data["document_spouse"],
            date_of=data["date_of"],
            date_of_registration=data["date_of_registration"],
        )
        existing_document = RecordData.query.filter_by(
            registry_number=data["registry_number"], type=data["type"]
        ).first()
        if existing_document:
            return (
                jsonify(
                    {
                        "message": f"Data already exists: {data['registry_number']}",
                        "status": "duplicate",
                    }
                ),
                409,
            )
        db.session.add(records)
        db.session.commit()

        return (
            jsonify({"message": data}),
            201,
        )
    except Exception as e:
        return jsonify({"message": "Something went wrong.", "status": "error"}), 500


@app.route("/records/delete/<int:id>", methods=["DELETE"])
@jwt_required()
def remove_record(id):
    try:
        record = RecordData.query.filter_by(id=id).first()

        db.session.delete(record)
        db.session.commit()

        return (
            jsonify({"message": "Deleted", "status": "Success"}),
            201,
        )

    except NotFound:
        return jsonify({"message": "Document not found", "status": "Error"}), 404


# Petition Records
@app.route("/petition/<int:id>", methods=["GET"])
@jwt_required()
def petition(id):
    try:
        petition = Petitions.query.filter_by(id=id).first_or_404()
        if not petition:
            return jsonify({"message": "Petition not found"}), 404

        petition_data = {
            "id": petition.id,
            "type": petition.type,
            "document_type": petition.document_type,
            "petition_number": petition.petition_number,
            "petitioner_name": petition.petitioner_name,
            "nationality": petition.nationality,
            "petitioner_address": petition.petitioner_address,
            "cce_in": petition.cce_in,
            "name_owner": petition.name_owner,
            "relation_owner": petition.relation_owner,
            "date_of": petition.date_of,
            "at_city": petition.at_city,
            "at_province": petition.at_province,
            "at_country": petition.at_country,
            "registry_number": petition.registry_number,
            "reason": petition.reason,
            "LCRO_city": petition.LCRO_city,
            "LCRO_province": petition.LCRO_province,
            "administering_officer": petition.administering_officer,
            "administering_position": petition.administering_position,
            "SwornDate": petition.SwornDate,
            "SwornCity": petition.SwornCity,
            "Ctc": petition.Ctc,
            "CtcIssuedOn": petition.CtcIssuedOn,
            "CtcIssuedAt": petition.CtcIssuedAt,
            "action": petition.action,
            "ActionDate": petition.ActionDate,
            "mcr": petition.mcr,
            "decision": petition.decision,
            "or_number": petition.or_number,
            "amount_paid": petition.amount_paid,
            "DatePaid": petition.DatePaid,
            "notice_posting": petition.notice_posting,
            "certificate_posting_start": petition.certificate_posting_start,
            "certificate_posting_end": petition.certificate_posting_end,
            "date_issued": petition.date_issued,
            "date_granted": petition.date_granted,
            "filepath": petition.filepath,
        }
        return jsonify(petition_data)

    except BadRequest as e:
        return jsonify({"message": "Invalid petition ID (must be an integer)"}), 400

    except Exception as e:
        abort(500, f"An error occurred: {str(e)}")


@app.route("/petitions", methods=["GET", "POST"])
@jwt_required()
def petitions():
    petitions = db.session.execute(
        db.select(Petitions).order_by(desc(Petitions.id))
    ).scalars()
    petition_list = []

    for petition in petitions:
        mapped_petition = {
            column.key: getattr(petition, column.key)
            for column in class_mapper(Petitions).columns
        }
        petition_list.append(mapped_petition)

    return jsonify(
        {
            "message": "success",
            "petitions": petition_list,
        }
    )


@app.route("/petitions/latest/petition_number", methods=["GET"])
@jwt_required()
def get_latest_petition_number():
    latest_cce_petition = db.session.execute(
        db.select(Petitions)
        .where(Petitions.type == "CCE")
        .order_by(desc(Petitions.id))
        .limit(1)
    ).scalar()

    latest_cfn_petition = db.session.execute(
        db.select(Petitions)
        .where(Petitions.type == "CFN")
        .order_by(desc(Petitions.id))
        .limit(1)
    ).scalar()

    result = {
        "CCE": (
            latest_cce_petition.petition_number
            if latest_cce_petition
            else "CCE-0000-0000"
        ),
        "CFN": (
            latest_cfn_petition.petition_number
            if latest_cfn_petition
            else "CFN-0000-0000"
        ),
    }

    return jsonify({"message": "success", "petitions": result})


@app.route("/petitions/add", methods=["POST"])
@jwt_required()
def add_petition():
    try:
        data = request.get_json()
        petition = Petitions(
            type=data["type"],
            document_type=data["document_type"],
            petition_number=data["petition_number"],
            petitioner_name=data["petitioner_name"],
            nationality=data["nationality"],
            petitioner_address=data["petitioner_address"],
            cce_in=data["cce_in"],
            name_owner=data["name_owner"],
            relation_owner=data["relation_owner"],
            date_of=data["date_of"],
            at_city=data["at_city"],
            at_province=data["at_province"],
            at_country=data["at_country"],
            registry_number=data["registry_number"],
            reason=data["reason"],
            LCRO_city=data["LCRO_city"],
            LCRO_province=data["LCRO_province"],
            administering_officer=data["administering_officer"],
            administering_position=data["administering_position"],
            SwornDate=data["SwornDate"],
            SwornCity=data["SwornCity"],
            Ctc=data["Ctc"],
            CtcIssuedOn=data["CtcIssuedOn"],
            CtcIssuedAt=data["CtcIssuedAt"],
            action=data["action"],
            ActionDate=data["ActionDate"],
            mcr=data["mcr"],
            decision=data["decision"],
            or_number=data["or_number"],
            amount_paid=data["amount_paid"],
            DatePaid=data["DatePaid"],
            notice_posting=data["notice_posting"],
            certificate_posting_start=data["certificate_posting_start"],
            certificate_posting_end=data["certificate_posting_end"],
            date_issued=data["date_issued"],
            date_granted=data["date_granted"],
            filepath=data["filepath"],
        )
        existing_document = Petitions.query.filter_by(
            petition_number=data["petition_number"]
        ).first()
        if existing_document:
            return (
                jsonify(
                    {
                        "message": f"Data already exists: {data['name']}",
                        "status": "duplicate",
                    }
                ),
                409,
            )
        db.session.add(petition)
        db.session.commit()

        return (
            jsonify({"message": data}),
            201,
        )
    except Exception as e:
        return jsonify({"message": "Something went wrong.", "status": "error"}), 500


# Scanned Documents
@app.route("/scanned", methods=["GET", "POST"])
@jwt_required()
def scanned():

    scans = db.session.execute(
        db.select(ScannedDocuments).order_by(desc(ScannedDocuments.id))
    ).scalars()
    scans_list = []

    for scan in scans:
        mapped_scan = {
            column.key: getattr(scan, column.key)
            for column in class_mapper(ScannedDocuments).columns
        }
        scans_list.append(mapped_scan)

    return jsonify(
        {
            "message": "success",
            "scans": scans_list,
        }
    )


@app.route("/scanned/log/add", methods=["GET", "POST"])
@jwt_required()
def scanned_log_add():
    try:
        data = request.get_json()

        for item in data:
            document_log = DocumentsLog(
                name=item["name"],
                action=item["action"],
                action_by=current_user.username,
                device_used=item["device_used"],
            )
            db.session.add(document_log)
        db.session.commit()
        return (
            jsonify({"message": "Documents added successfully", "status": "success"}),
            201,
        )
    except Exception as e:
        return jsonify({"message": "Error Adding Log", "status": "error"}), 500


@app.route("/scanned/log/view", methods=["GET", "POST"])
@jwt_required()
def scanned_log_list():

    scanned_logs = db.session.execute(
        db.select(DocumentsLog).order_by(desc(DocumentsLog.id))
    ).scalars()
    scanned_list = []

    for scan in scanned_logs:
        mapped_scan = {
            column.key: getattr(scan, column.key)
            for column in class_mapper(DocumentsLog).columns
        }
        scanned_list.append(mapped_scan)

    return jsonify(
        {
            "message": "success",
            "scans": scanned_list,
        }
    )


@app.route("/scanned/log/view/<string:user_name>", methods=["GET"])
@jwt_required()
def scanned_log_by_user(user_name):

    scanned_logs = db.session.execute(
        db.select(DocumentsLog)
        .order_by(desc(DocumentsLog.id))
        .where(DocumentsLog.action_by == user_name)
    ).scalars()
    scanned_list = []

    for scan in scanned_logs:
        mapped_scan = {
            column.key: getattr(scan, column.key)
            for column in class_mapper(DocumentsLog).columns
        }
        scanned_list.append(mapped_scan)

    return jsonify(
        {
            "logs": scanned_list,
        }
    )


@app.route("/scanned/add", methods=["POST"])
@jwt_required()
def add():
    try:

        data = request.get_json()

        for item in data:
            if not all(
                field in item
                for field in [
                    "name",
                    "filepath",
                    "type",
                    "year",
                    "uploaded_by",
                    "device_used",
                ]
            ):
                return (
                    jsonify(
                        {
                            "message": "Missing required field in object",
                            "status": "required",
                        }
                    ),
                    400,
                )

            existing_document = ScannedDocuments.query.filter_by(
                filepath=item["filepath"]
            ).first()
            if existing_document:
                return (
                    jsonify(
                        {
                            "message": f"Data already exists: {item['name']}",
                            "status": "duplicate",
                        }
                    ),
                    409,
                )
            new_document = ScannedDocuments(**item)
            db.session.add(new_document)

        db.session.commit()
        return (
            jsonify({"message": "Documents added successfully", "status": "success"}),
            201,
        )
    except Exception as e:
        return jsonify({"message": "Something went wrong.", "status": "error"}), 500


@app.route(
    "/scanned/delete/<int:id>&<string:device_used_to_delete>", methods=["DELETE"]
)
@jwt_required()
def remove_scanned(id, device_used_to_delete):
    try:
        scanned = ScannedDocuments.query.get(id)

        restored_doc = RestoreDocuments(
            name=scanned.name,
            filepath=scanned.filepath,
            month=scanned.month,
            year=scanned.year,
            type=scanned.type,
            device_used=scanned.device_used,
            deleted_by=current_user.username,
            device_used_to_delete=device_used_to_delete,
        )
        document_log = DocumentsLog(
            name=scanned.name,
            action="Deleted",
            action_by=current_user.username,
            device_used=device_used_to_delete,
        )
        db.session.add(restored_doc)
        db.session.add(document_log)
        db.session.delete(scanned)
        db.session.commit()

        return (
            jsonify(
                {"message": "Document moved to RestoreDocuments", "status": "Success"}
            ),
            201,
        )

    except NotFound:
        return jsonify({"message": "Document not found", "status": "Error"}), 404


# Scanned Documents


if __name__ == "__main__":
    signal.signal(signal.SIGTERM, handle_sigterm)
    CORS(app)
    app.run(host="0.0.0.0", port=1216, debug=True)
