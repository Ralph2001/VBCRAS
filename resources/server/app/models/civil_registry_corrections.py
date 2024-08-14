from ..extensions import db

# This is example of Redundant table
class Ra9048CceRecords(db.Model):
    __tablename__ = 'ra_9048_cce_records'
    
    id = db.Column(db.Integer, primary_key=True)
    
    date_filed = db.Column(db.String, nullable=False),
    event_type = db.Column(db.String, nullable=False), # Value could be 'Birth', 'Death', 'Marriage'
    
    petition_number = db.Column(db.String, nullable=False, unique=True),
    petitioner_name = db.Column(db.String, nullable=False),
    nationality = db.Column(db.String, nullable=False),
    petitioner_address = db.Column(db.String, nullable=False),
    petition_error_in = db.Column(db.String, nullable=False),
    document_owner = db.Column(db.String, nullable=False),
    relation_owner = db.Column(db.String, nullable=False),
    event_date = db.Column(db.String, nullable=False, comment='Date of Birth, Date of Marriage, Date of Death'),
    event_country = db.Column(db.String, nullable=False),
    event_province = db.Column(db.String, nullable=False),
    event_municipality = db.Column(db.String, nullable=False),
    registry_number = db.Column(db.String, nullable=False),
    reasons = db.Column(db.String, nullable=False),
    filing_city_municipality = db.Column(db.String, nullable=False),
    filing_province = db.Column(db.String, nullable=False),
    
    # Page 2
    administering_officer_name = db.Column(db.String, nullable=False),
    administering_officer_position = db.Column(db.String, nullable=False),
    subscribe_sworn_date = db.Column(db.String, nullable=False),
    subscribe_sworn_city_municipality = db.Column(db.String, nullable=False),
    community_tax_certificate = db.Column(db.String, nullable=False),
    issued_at = db.Column(db.String, nullable=False),
    issued_on = db.Column(db.String, nullable=False),
    # Action
    action_taken = db.Column(db.String, nullable=False),
    action_taken_date = db.Column(db.String, nullable=False),
    action_taken_decision = db.Column(db.String, nullable=False),
    municipal_civil_registrar = db.Column(db.String, nullable=False),
    # Payment
    o_r_number = db.Column(db.String, nullable=False),
    amount_paid = db.Column(db.String, nullable=False),
    date_paid = db.Column(db.String, nullable=False),
    
    


class Ra9048CfnRecords(db.Model):
    __tablename__ = 'ra_9048_cfn_records'
    
       
    id = db.Column(db.Integer, primary_key=True)
    
    date_filed = db.Column(db.String, nullable=False),
    event_type = db.Column(db.String, nullable=False), # Value could be 'Birth', 'Death', 'Marriage'
    
    petition_number = db.Column(db.String, nullable=False, unique=True),
    petitioner_name = db.Column(db.String, nullable=False),
    nationality = db.Column(db.String, nullable=False),
    petitioner_address = db.Column(db.String, nullable=False),
    petition_error_in = db.Column(db.String, nullable=False),
    document_owner = db.Column(db.String, nullable=False),
    relation_owner = db.Column(db.String, nullable=False),
    event_date = db.Column(db.String, nullable=False, comment='Date of Birth, Date of Marriage, Date of Death'),
    event_country = db.Column(db.String, nullable=False),
    event_province = db.Column(db.String, nullable=False),
    event_municipality = db.Column(db.String, nullable=False),
    registry_number = db.Column(db.String, nullable=False),

    first_name_from = db.Column(db.String, nullable=False),
    first_name_to = db.Column(db.String, nullable=False),
    
    
    ground_a = db.Column(db.Boolean, nullable=True, default=False),
    ground_b = db.Column(db.Boolean, nullable=True, default=False),
    ground_c = db.Column(db.Boolean, nullable=True, default=False),
    ground_d = db.Column(db.Boolean, nullable=True, default=False),
    ground_e = db.Column(db.Boolean, nullable=True, default=False),
    ground_f = db.Column(db.Boolean, nullable=True, default=False),


    ground_b_data = db.Column(db.String, nullable=True),
    ground_f_data = db.Column(db.String, nullable=True),
    
    # Page 2
    administering_officer_name = db.Column(db.String, nullable=False),
    administering_officer_position = db.Column(db.String, nullable=False),
    subscribe_sworn_date = db.Column(db.String, nullable=False),
    subscribe_sworn_city_municipality = db.Column(db.String, nullable=False),
    community_tax_certificate = db.Column(db.String, nullable=False),
    issued_at = db.Column(db.String, nullable=False),
    issued_on = db.Column(db.String, nullable=False),
    
    # Action
    action_taken = db.Column(db.String, nullable=False),
    action_taken_date = db.Column(db.String, nullable=False),
    action_taken_decision = db.Column(db.String, nullable=False),
    municipal_civil_registrar = db.Column(db.String, nullable=False),
    
    # Payment
    o_r_number = db.Column(db.String, nullable=False),
    amount_paid = db.Column(db.String, nullable=False),
    date_paid = db.Column(db.String, nullable=False),
    


class Ra10172CceRecords(db.Model):
    __tablename__ = 'ra_10172_cce_records'
    
    id = db.Column(db.Integer, primary_key=True)
    
    date_filed = db.Column(db.String, nullable=False),
    event_type = db.Column(db.String, nullable=False), # Value could be 'Birth', 'Death', 'Marriage'
    
    petition_number = db.Column(db.String, nullable=False, unique=True),
    petitioner_name = db.Column(db.String, nullable=False),
    nationality = db.Column(db.String, nullable=False),
    petitioner_address = db.Column(db.String, nullable=False),
    petition_error_in = db.Column(db.String, nullable=False),
    document_owner = db.Column(db.String, nullable=False),
    relation_owner = db.Column(db.String, nullable=False),
    event_date = db.Column(db.String, nullable=False, comment='Date of Birth, Date of Marriage, Date of Death'),
    event_country = db.Column(db.String, nullable=False),
    event_province = db.Column(db.String, nullable=False),
    event_municipality = db.Column(db.String, nullable=False),
    registry_number = db.Column(db.String, nullable=False),
    reasons = db.Column(db.String, nullable=False),
    filing_city_municipality = db.Column(db.String, nullable=False),
    filing_province = db.Column(db.String, nullable=False),
    
    # Page 2
    administering_officer_name = db.Column(db.String, nullable=False),
    administering_officer_position = db.Column(db.String, nullable=False),
    subscribe_sworn_date = db.Column(db.String, nullable=False),
    subscribe_sworn_city_municipality = db.Column(db.String, nullable=False),
    community_tax_certificate = db.Column(db.String, nullable=False),
    issued_at = db.Column(db.String, nullable=False),
    issued_on = db.Column(db.String, nullable=False),

    # Payment
    o_r_number = db.Column(db.String, nullable=False),
    amount_paid = db.Column(db.String, nullable=False),
    date_paid = db.Column(db.String, nullable=False),

    
    
# This Table is for 9048 CCE and 10172 CCE Only
class ClericalErros(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    petition_table_name = db.Column(db.String, nullable=False),
    petition_id = db.Column(db.String, nullable=False),
    description = db.Column(db.String, nullable=False),
    from_this = db.Column(db.String, nullable=False),
    to_this = db.Column(db.String, nullable=False),
    
# This Table is for all
class SupportingDocuments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    petition_table_name = db.Column(db.String, nullable=False),
    petition_id = db.Column(db.String, nullable=False),

# This Table is for 10172 CCE Only
class Ra10172CceReasons(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    petition_id = db.Column(db.String, nullable=False),   
    error_number = db.Column(db.String, nullable=False),  
    reason = db.Column(db.String, nullable=False),   

# This Table is for 10172 CCE Only
class Ra10172CceActionTaken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    petition_id = db.Column(db.String, nullable=False),   
    error_number = db.Column(db.String, nullable=False),  
    action_taken = db.Column(db.String, nullable=False),
    action_taken_date = db.Column(db.String, nullable=False),
    action_taken_decision = db.Column(db.String, nullable=False),
    municipal_civil_registrar = db.Column(db.String, nullable=False),