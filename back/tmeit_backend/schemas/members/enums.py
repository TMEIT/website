from enum import Enum


class CurrentRoleEnum(str, Enum):
    """Used to define what role a member *currently* has."""
    master = "master"
    marshal = "marshal"
    prao = "prao"
    vraq = "vraq"
    ex = "ex"
    exprao = "exprao"

    # Marshal Roles - WebbMarshal, GourmetMarshal, JunkMarshal
    webbmarshal =       "WebbMarshal"
    gourmetmarshal =    "GourmetMarshal"
    junkmarshal =       "JunkMarshal"

    # Prao Roles - WebbPrao, GourmetPrao, JunkPrao
    webbprao =          "WebbPrao"
    gourmetprao =       "GourmetPrao"
    junkprao =          "JunkPrao"

    # Vraq Roles - WebbVraq, GourmetVraq, JunkVraq
    webbvraq =          "WebbVraq"
    gourmetvraq =       "GourmetVraq"
    junkvraq =          "JunkVraq"

    def is_active(self):
        return self.value != "exprao"
