from lxml import etree as ET
from classes.realParameter import RealParameter
from classes.eqBand import EqBand
from classes.unit import Unit  # Assuming this is where the Unit enum is defined


class Equalizer:
    def __init__(
        self,
        device_name=None,
        device_role=None,
        bands=None,
        input_gain=None,
        output_gain=None,
    ):
        self.device_name = device_name  # The required deviceName attribute
        self.device_role = device_role  # The required deviceRole attribute
        self.bands = bands if bands is not None else []

        # Ensure input_gain and output_gain are RealParameter instances
        self.input_gain = (
            input_gain
            if isinstance(input_gain, RealParameter)
            else RealParameter(input_gain)
        )
        self.output_gain = (
            output_gain
            if isinstance(output_gain, RealParameter)
            else RealParameter(output_gain)
        )

    def to_xml(self):
        eq_elem = ET.Element("Equalizer")

        # Set the required deviceName attribute
        if self.device_name:
            eq_elem.set("deviceName", self.device_name)
        else:
            raise ValueError("deviceName attribute is required but not provided.")

        # Set the required deviceRole attribute
        if self.device_role:
            eq_elem.set("deviceRole", self.device_role)
        else:
            raise ValueError("deviceRole attribute is required but not provided.")

        # Add bands as child elements
        for band in self.bands:
            eq_elem.append(band.to_xml())

        # Add InputGain as a child element with the unit attribute
        input_gain_elem = ET.Element("InputGain")
        input_gain_elem.set(
            "unit", Unit.DECIBEL.value
        )  # Assuming the unit for InputGain is in decibels
        input_gain_elem.extend(self.input_gain.to_xml().getchildren())
        eq_elem.append(input_gain_elem)

        # Add OutputGain as a child element with the unit attribute
        output_gain_elem = ET.Element("OutputGain")
        output_gain_elem.set(
            "unit", Unit.DECIBEL.value
        )  # Assuming the unit for OutputGain is in decibels
        output_gain_elem.extend(self.output_gain.to_xml().getchildren())
        eq_elem.append(output_gain_elem)

        return eq_elem

    @classmethod
    def from_xml(cls, element):
        device_name = element.get("deviceName")
        if not device_name:
            raise ValueError("deviceName attribute is required but missing in the XML.")

        device_role = element.get("deviceRole")
        if not device_role:
            raise ValueError("deviceRole attribute is required but missing in the XML.")

        bands = []
        for band_elem in element.findall("Band"):
            bands.append(EqBand.from_xml(band_elem))

        # Extract the RealParameter from the InputGain and OutputGain elements
        input_gain_elem = element.find("InputGain")
        input_gain = RealParameter.from_xml(input_gain_elem.find("RealParameter"))

        output_gain_elem = element.find("OutputGain")
        output_gain = RealParameter.from_xml(output_gain_elem.find("RealParameter"))

        return cls(
            device_name=device_name,
            device_role=device_role,
            bands=bands,
            input_gain=input_gain,
            output_gain=output_gain,
        )
