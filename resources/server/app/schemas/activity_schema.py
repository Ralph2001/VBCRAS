from ..extensions import ma
from ..models.logs import ActivityLog
from .user_schema import CreatedUserSchema


class ActivityLogSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ActivityLog
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")  
