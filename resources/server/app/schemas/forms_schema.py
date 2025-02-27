from ..extensions import ma
from ..models.form import Form1A, Form2A, Form3A, Form1B, Form2B, Form3B, Form1C, Form2C, Form3C
from .user_schema import CreatedUserSchema  # Assuming you have a user schema

class Form1ASchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Form1A
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")

class Form2ASchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Form2A
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")

class Form3ASchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Form3A
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")

class Form1BSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Form1B
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")

class Form2BSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Form2B
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")

class Form3BSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Form3B
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")

class Form1CSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Form1C
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")

class Form2CSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Form2C
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")

class Form3CSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Form3C
        load_instance = True
        include_fk = True

    created_by_user = ma.Nested(CreatedUserSchema, attribute="users")