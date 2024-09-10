from ..extensions import ma
from ..models.user import Users



class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Users
        load_instance = True
        exclude = ("password",)
        
class CreatedUserSchema(ma.SQLAlchemyAutoSchema):
    class Meta: 
        model = Users
        load_instance = True
        exclude = ("password","id", "role",)
        
    