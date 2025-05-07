from enum import Enum


class MixerRole(Enum):
    REGULAR = "regular"
    MASTER = "master"
    EFFECT_TRACK = "effectTrack"
    SUB_MIX = "subMix"
    VCA = "vca"
