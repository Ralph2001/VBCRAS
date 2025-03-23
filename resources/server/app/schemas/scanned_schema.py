from ..extensions import ma
from ..models.scanned import Scans, ScannedType

class ScannedTypeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ScannedType
        load_instance = True
        exclude = ("id",)
        
class ScanListSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Scans
        fields = ("id", "name", "type_id", "year", "month", "scanned_type")

    scanned_type = ma.Nested(ScannedTypeSchema, many=False)
    
class ScanDetailSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Scans
        include_fk = True

    scanned_type = ma.Nested(ScannedTypeSchema, many=False)