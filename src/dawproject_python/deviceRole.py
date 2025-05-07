from enum import Enum


class DeviceRole(Enum):
    INSTRUMENT = "instrument"
    NOTE_FX = "noteFX"
    AUDIO_FX = "audioFX"
    ANALYZER = "analyzer"
