from ..extensions import ma
from ..models.system import SystemSettings

class SystemSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = SystemSettings
        load_instance = True


        
    