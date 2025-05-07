from lxml import etree as ET
from classes.realParameter import RealParameter
from classes.boolParameter import BoolParameter
from classes.builtInDevice import BuiltInDevice
from classes.unit import Unit  # Assuming this is where the Unit enum is defined


class Compressor(BuiltInDevice):
    def __init__(
        self,
        device_name=None,
        device_role=None,
        threshold=None,
        ratio=None,
        attack=None,
        release=None,
        input_gain=None,
        output_gain=None,
        auto_makeup=None,
    ):
        super().__init__()

        self.device_name = device_name  # The required deviceName attribute
        self.device_role = device_role  # The required deviceRole attribute
        # Ensure all parameters are RealParameter instances
        self.threshold = (
            threshold
            if isinstance(threshold, RealParameter)
            else RealParameter(threshold)
        )
        self.ratio = ratio if isinstance(ratio, RealParameter) else RealParameter(ratio)
        self.attack = (
            attack if isinstance(attack, RealParameter) else RealParameter(attack)
        )
        self.release = (
            release if isinstance(release, RealParameter) else RealParameter(release)
        )
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
        self.auto_makeup = (
            auto_makeup
            if isinstance(auto_makeup, BoolParameter)
            else BoolParameter(auto_makeup)
        )

    def to_xml(self):
        compressor_elem = ET.Element("Compressor")

        # Set the required deviceName attribute
        if self.device_name:
            compressor_elem.set("deviceName", self.device_name)
        else:
            raise ValueError("deviceName attribute is required but not provided.")

        # Set the required deviceRole attribute
        if self.device_role:
            compressor_elem.set("deviceRole", self.device_role)
        else:
            raise ValueError("deviceRole attribute is required but not provided.")

        # Define a helper function to add RealParameter elements
        def add_real_parameter_elem(parent_elem, tag, real_param, unit):
            param_elem = ET.Element(tag)
            param_elem.set("id", real_param.id)
            param_elem.set("value", str(real_param.value))
            param_elem.set("unit", unit)
            parent_elem.append(param_elem)

        add_real_parameter_elem(
            compressor_elem, "Attack", self.attack, Unit.SECONDS.value
        )
        # Add BoolParameter element with appropriate tag
        auto_makeup_elem = ET.Element("AutoMakeup")
        auto_makeup_elem.set("id", self.auto_makeup.id)
        auto_makeup_elem.set("value", str(self.auto_makeup.value).lower())
        compressor_elem.append(auto_makeup_elem)

        add_real_parameter_elem(
            compressor_elem, "InputGain", self.input_gain, Unit.DECIBEL.value
        )
        add_real_parameter_elem(
            compressor_elem, "OutputGain", self.output_gain, Unit.DECIBEL.value
        )

        # Add RealParameter elements with the required unit attributes

        add_real_parameter_elem(compressor_elem, "Ratio", self.ratio, Unit.PERCENT.value)

        add_real_parameter_elem(
            compressor_elem, "Release", self.release, Unit.SECONDS.value
        )

        add_real_parameter_elem(
            compressor_elem, "Threshold", self.threshold, Unit.DECIBEL.value
        )

        return compressor_elem

    @classmethod
    def from_xml(cls, element):
        device_name = element.get("deviceName")
        if not device_name:
            raise ValueError("deviceName attribute is required but missing in the XML.")

        device_role = element.get("deviceRole")
        if not device_role:
            raise ValueError("deviceRole attribute is required but missing in the XML.")

        threshold = RealParameter.from_xml(element.find("Threshold"))
        ratio = RealParameter.from_xml(element.find("Ratio"))
        attack = RealParameter.from_xml(element.find("Attack"))
        release = RealParameter.from_xml(element.find("Release"))
        input_gain = RealParameter.from_xml(element.find("InputGain"))
        output_gain = RealParameter.from_xml(element.find("OutputGain"))
        auto_makeup = BoolParameter.from_xml(element.find("AutoMakeup"))

        return cls(
            device_name=device_name,
            device_role=device_role,
            threshold=threshold,
            ratio=ratio,
            attack=attack,
            release=release,
            input_gain=input_gain,
            output_gain=output_gain,
            auto_makeup=auto_makeup,
        )
