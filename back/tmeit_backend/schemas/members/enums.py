from enum import Enum


class CurrentRoleEnum(str, Enum):
    """Used to define what role a member *currently* has."""
    master = "master"
    marshal = "marshal"
    prao = "prao"
    vraq = "vraq"
    ex = "ex"
    inactive = "inactive"
    exprao = "exprao"

    def is_active(self):
        return self.value != "exprao"
