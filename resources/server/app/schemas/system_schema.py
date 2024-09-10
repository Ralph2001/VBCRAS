from ..extensions import ma
from ..models.system import SystemSettings
from ..models.scanned import ScannedType
# from ..models.user import Positions


class SystemSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = SystemSettings
        load_instance = True

class ScannedTypeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ScannedType
        load_instance = True        
# class PositionSchema(ma.SQLAlchemyAutoSchema):
#     class Meta:
#         model = Positions
#         load_instance = True