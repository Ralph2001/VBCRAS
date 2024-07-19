from ..extensions import db, jsonify, Blueprint
from ..models.scanned import ScannedType

scanned = Blueprint("scanned", __name__)


@scanned.route("/scanned/<name>")
def create_scanned_type(name):
    type = ScannedType(name=name)
    db.session.add(type)
    db.session.commit()

    return "Done"
