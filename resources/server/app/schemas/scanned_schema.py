from ..extensions import ma
from ..models.scanned import Scans, ScannedType

class ScannedTypeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ScannedType
        load_instance = True
        exclude = ("id",)
        
class ScannnedSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Scans
        load_instance = True
        include_fk = True

    scanned_type = ma.Nested(ScannedTypeSchema, many=False) 
