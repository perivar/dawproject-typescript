from lxml import etree as ET
from classes.referenceable import Referenceable
from classes.boolParameter import BoolParameter
from classes.deviceRole import DeviceRole
from classes.fileReference import FileReference
from classes.parameter import Parameter


class Device(Referenceable):
    def __init__(
        self,
        enabled=None,
        device_role=None,
        loaded=True,
        device_name=None,
        device_id=None,
        device_vendor=None,
        state=None,
        automated_parameters=None,
        name=None,
        color=None,
        comment=None,
    ):
        super().__init__(name, color, comment)
        self.enabled = enabled
        self.device_role = device_role
        self.loaded = loaded
        self.device_name = device_name
        self.device_id = device_id
        self.device_vendor = device_vendor
        self.state = state
        self.automated_parameters = automated_parameters if automated_parameters else []

    def to_xml(self):
        device_elem = super().to_xml()
        device_elem.tag = "Device"

        if self.automated_parameters:
            parameters_elem = ET.SubElement(device_elem, "Parameters")
            for param in self.automated_parameters:
                parameters_elem.append(param.to_xml())

        if self.enabled is not None:
            ET.SubElement(device_elem, "Enabled")

        if self.device_role is not None:
            device_elem.set("deviceRole", self.device_role.value)

        if self.loaded is not None:
            device_elem.set("loaded", str(self.loaded).lower())

        if self.device_name is not None:
            device_elem.set("deviceName", self.device_name)

        if self.device_id is not None:
            device_elem.set("deviceID", self.device_id)

        if self.device_vendor is not None:
            device_elem.set("deviceVendor", self.device_vendor)

        if self.state:
            device_elem.append(self.state.to_xml())

        return device_elem

    @classmethod
    def from_xml(cls, element):
        instance = super().from_xml(element)

        enabled_elem = element.find("Enabled")
        instance.enabled = (
            BoolParameter.from_xml(enabled_elem) if enabled_elem is not None else None
        )

        device_role = element.get("deviceRole")
        instance.device_role = DeviceRole(device_role) if device_role else None

        loaded = element.get("loaded")
        instance.loaded = loaded.lower() == "true" if loaded else True

        instance.device_name = element.get("deviceName")
        instance.device_id = element.get("deviceID")
        instance.device_vendor = element.get("deviceVendor")

        state_elem = element.find("State")
        instance.state = (
            FileReference.from_xml(state_elem) if state_elem is not None else None
        )

        parameters_elem = element.find("Parameters")
        parameters = []
        if parameters_elem is not None:
            for param_elem in parameters_elem:
                param_class = globals().get(param_elem.tag)
                if param_class and issubclass(param_class, Parameter):
                    parameters.append(param_class.from_xml(param_elem))
        instance.automated_parameters = parameters

        return instance
