from ..extensions import ma
from ..models.ausf import Ausf
from .user_schema import CreatedUserSchema


class AusfSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Ausf
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")  # Include related User
