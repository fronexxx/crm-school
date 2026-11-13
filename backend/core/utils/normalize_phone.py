import re


def normalize_phone(value: str):
    if not value or not value.strip():
        return None

    value = value.strip()

    if value.startswith('0'):
        value = '+38' + value

    elif value.startswith('380'):
        value = '+' + value

    if not re.fullmatch(r'\+380\d{9}', value):
        raise ValueError('Invalid phone number. The correct format is +380XXXXXXXXX')

    return value