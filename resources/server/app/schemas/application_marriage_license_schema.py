from ..extensions import ma
from ..models.application_marriage_license import ApplicationMarriageLicense
from .user_schema import CreatedUserSchema

class ApplicationMarriageLicenseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ApplicationMarriageLicense
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")  
