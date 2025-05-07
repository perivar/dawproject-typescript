from lxml import etree as ET
from classes.device import Device


class BuiltInDevice(Device):
    def __init__(self, device_type=None):
        self.device_type = device_type  # This could be one of Equalizer, Compressor, NoiseGate, Limiter

    def to_xml(self):
        # Create the root element for BuiltinDevice
        device_elem = ET.Element("BuiltinDevice")

        # Depending on the device_type, serialize it to XML
        if self.device_type:
            device_elem.append(self.device_type.to_xml())

        return device_elem

    @classmethod
    def from_xml(cls, element):
        # Lazy import to avoid circular dependency
        from classes.equalizer import Equalizer
        from classes.compressor import Compressor

        # Import NoiseGate and Limiter here if they exist

        # Logic to determine the actual device type
        device_type = None
        if element.find("Equalizer") is not None:
            device_type = Equalizer.from_xml(element.find("Equalizer"))
        elif element.find("Compressor") is not None:
            device_type = Compressor.from_xml(element.find("Compressor"))
        # Add other device types similarly

        return cls(device_type=device_type)
