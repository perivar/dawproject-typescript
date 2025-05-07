from enum import Enum


class EqBandType(Enum):
    HIGH_PASS = "highPass"
    LOW_PASS = "lowPass"
    BAND_PASS = "bandPass"
    HIGH_SHELF = "highShelf"
    LOW_SHELF = "lowShelf"
    BELL = "bell"
    NOTCH = "notch"
