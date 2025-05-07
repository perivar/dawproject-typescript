from lxml import etree as ET
from classes.realParameter import RealParameter
from classes.boolParameter import BoolParameter
from classes.eqBandType import EqBandType
from classes.unit import Unit  # Assuming this is where the Unit enum is defined


class EqBand:
    def __init__(
        self, freq=None, gain=None, q=None, enabled=None, band_type=None, order=None
    ):
        # Ensure freq, gain, and q are RealParameter instances
        self.freq = freq if isinstance(freq, RealParameter) else RealParameter(freq)
        self.gain = gain if isinstance(gain, RealParameter) else RealParameter(gain)
        self.q = q if isinstance(q, RealParameter) else RealParameter(q)

        self.enabled = (
            enabled if isinstance(enabled, BoolParameter) else BoolParameter(enabled)
        )
        self.band_type = band_type  # Expected to be an instance of EqBandType
        self.order = order  # Expected to be an integer or None

    def to_xml(self):
        band_elem = ET.Element("Band")

        # Create specific elements for Freq, Gain, and Q with the required unit attribute from the Unit enum
        freq_elem = ET.Element("Freq")
        freq_elem.set("id", self.freq.id)
        freq_elem.set("value", str(self.freq.value))
        freq_elem.set("unit", Unit.HERTZ.value)  # Using the Unit enum for frequency

        gain_elem = ET.Element("Gain")
        gain_elem.set("id", self.gain.id)
        gain_elem.set("value", str(self.gain.value))
        gain_elem.set("unit", Unit.DECIBEL.value)  # Using the Unit enum for gain

        q_elem = ET.Element("Q")
        q_elem.set("id", self.q.id)
        q_elem.set("value", str(self.q.value))
        q_elem.set(
            "unit", Unit.LINEAR.value
        )  # Assuming Q is unitless but using a suitable enum value

        # Add these elements to the Band element
        band_elem.append(freq_elem)
        band_elem.append(gain_elem)
        band_elem.append(q_elem)

        # Add BoolParameter element with appropriate tag
        enabled_elem = ET.Element("Enabled")
        enabled_elem.set("id", self.enabled.id)
        enabled_elem.set("value", str(self.enabled.value).lower())
        band_elem.append(enabled_elem)

        # Set attributes
        if self.band_type is not None:
            band_elem.set(
                "type", str(self.band_type.value)
            )  # Assuming EqBandType has a 'value' attribute
        if self.order is not None:
            band_elem.set("order", str(self.order))

        return band_elem

    @classmethod
    def from_xml(cls, element):
        # Parse specific elements Freq, Gain, and Q
        freq = RealParameter.from_xml(element.find("Freq"))
        gain = RealParameter.from_xml(element.find("Gain"))
        q = RealParameter.from_xml(element.find("Q"))

        # Parse BoolParameter element
        enabled = BoolParameter.from_xml(element.find("Enabled"))

        # Parse attributes
        band_type = EqBandType(element.get("type")) if element.get("type") else None
        order = int(element.get("order")) if element.get("order") else None

        return cls(
            freq=freq, gain=gain, q=q, enabled=enabled, band_type=band_type, order=order
        )
