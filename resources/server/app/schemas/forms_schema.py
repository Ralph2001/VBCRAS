from ..extensions import ma
from ..models.form import BirthAvailable, DeathAvailable, MarriageAvailable, BirthIntact, DeathIntact, MarriageIntact, BirthDestroyed, DeathDestroyed, MarriageDestroyed
from .user_schema import CreatedUserSchema  # Assuming you have a user schema

class Form1ASchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BirthAvailable
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")

class Form2ASchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = DeathAvailable
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")

class Form3ASchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MarriageAvailable
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")

class Form1BSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BirthIntact
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")

class Form2BSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = DeathIntact
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")

class Form3BSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MarriageIntact
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")

class Form1CSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BirthDestroyed
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")

class Form2CSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = DeathDestroyed
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")

class Form3CSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MarriageDestroyed
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")