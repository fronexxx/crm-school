from enum import Enum
from datetime import timedelta

class ActionTokenEnum(Enum):
    ACTIVATE = (
        'activate',
        timedelta(minutes=30),
    )

    RECOVERY = (
        'recovery',
        timedelta(minutes=30),
    )

    def __init__(self, token_type, lifetime):
        self.token_type = token_type
        self.lifetime = lifetime


