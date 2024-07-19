from ..extensions import ma
from ..models.ausf import Ausf

class AusfSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Ausf
        load_instance = True