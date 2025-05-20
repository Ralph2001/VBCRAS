from ..extensions import ma
from ..models.scanned import Scans, ScannedType

class ScannedTypeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ScannedType
        load_instance = True
        exclude = ("id",)  # Exclude 'id' if it's not needed in API responses

class ScanListSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Scans
        load_instance = True  # <-- Critical for deserialization to model instances
        include_fk = True
        fields = (
            "id", "name", "type_id", "year", "month",
            "filepath", "uploaded_by", "scanned_type"
        )

    scanned_type = ma.Nested(ScannedTypeSchema)

class ScanDetailSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Scans
        load_instance = True
        include_fk = True

    scanned_type = ma.Nested(ScannedTypeSchema)
