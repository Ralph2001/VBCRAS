from ..extensions import ma
from ..models.civil_registry_corrections import Petitions, PetitionReasons, PetitionActions, PetitionClericalErrors, PetitionSupportingDocuments
from .user_schema import CreatedUserSchema

class PetitionClericalErrorsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PetitionClericalErrors
        load_instance = True

class PetitionSupportingDocumentsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PetitionSupportingDocuments
        load_instance = True

class PetitionActionsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PetitionActions
        load_instance = True

class PetitionReasonsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PetitionReasons
        load_instance = True

class PetitionSchema(ma.SQLAlchemyAutoSchema):
    clerical_errors = ma.Nested(PetitionClericalErrorsSchema, many=True)
    supporting_documents = ma.Nested(PetitionSupportingDocumentsSchema, many=True)
    petition_actions = ma.Nested(PetitionActionsSchema, many=True)
    reasons = ma.Nested(PetitionReasonsSchema, many=True)
    created_by_user = ma.Nested(CreatedUserSchema, attribute="users") 

    class Meta:
        model = Petitions
        load_instance = True
        include_fk = True
