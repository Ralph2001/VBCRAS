from ..extensions import ma
from ..models.form import Forms, BirthAvailable,DeathAvailable,MarriageAvailable

class FormsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Forms
        load_instance = True  # Automatically create model instances

class BirthAvailableSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BirthAvailable
        load_instance = True

class DeathAvailableSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = DeathAvailable
        load_instance = True

class MarriageAvailableSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MarriageAvailable
        load_instance = True
        include_fk = True
