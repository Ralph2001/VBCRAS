from ..extensions import ma
from ..models.scanned import Scans, ScannedType

class ScannnedSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Scans
        load_instance = True
        include_fk = True

    scanned_type = ma.Nested(ScannedType, attribute="scanned_type") 
