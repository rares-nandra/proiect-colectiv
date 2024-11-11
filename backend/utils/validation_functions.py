import re

def validate_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w{2,4}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    if len(password)<8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    return True

def validate_non_empty(field):
    return bool(field and field.strip())

def validate_phone_number(phone_number):
    if len(phone_number) != 10:
        return False
    pattern = r'^0\d{9}$'
    return re.match(pattern, phone_number) is not None


def validate_signup(data):
    return(
        validate_non_empty(data['username']) and
        validate_email(data['email']) and
        validate_password(data['password']) and
        validate_phone_number(data['phone_number'])
    )

def validate_login(data):
    return (
        validate_email(data['email']) and
        validate_password(data['password'])
    )



