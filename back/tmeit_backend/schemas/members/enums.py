from enum import Enum


class CurrentRoleEnum(str, Enum):
    """Used to define what role a member *currently* has."""
    master =            "master"
    marshal =           "marshal"
    prao =              "prao"
    vraq =              "vraq"
    ex =                "ex"
    exprao =            "exprao"

    # Marshal roles - Webb, Gourmet and Junk
    webbmarshal =       "WebbMarshal"
    gourmetmarshal =    "GourmetMarshal"
    junkmarshal =       "JunkMarshal"

    # Prao roles - Webb, Gourmet and Junk
    webbprao =          "WebbPrao"
    gourmetprao =       "GourmetPrao"
    junkprao =          "JunkPrao"

    # Vraq roles - Webb, Gourmet and Junk
    webbvraq =          "WebbVraq"
    gourmetvraq =       "GourmetVraq"
    junkvraq =          "JunkVraq"

    def is_active(self):
        return self.value != "exprao"
