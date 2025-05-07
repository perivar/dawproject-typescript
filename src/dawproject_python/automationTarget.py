from lxml import etree as ET


class AutomationTarget:
    def __init__(
        self, parameter=None, expression=None, channel=None, key=None, controller=None
    ):
        self.parameter = parameter
        self.expression = expression
        self.channel = channel
        self.key = key
        self.controller = controller

    def to_xml(self):
        target_elem = ET.Element("Target")
        if self.parameter:
            # Ensure parameter is a string or get its ID
            parameter_id = getattr(self.parameter, "id", None) or getattr(
                self.parameter, "parameterID", None
            )
            if parameter_id is not None:
                target_elem.set("parameter", str(parameter_id))
            else:
                raise TypeError(
                    f"Expected parameter to be a string or an object with 'id' or 'parameterID', got {type(self.parameter).__name__}"
                )

        if self.expression:
            target_elem.set("expression", self.expression)
        if self.channel is not None:
            target_elem.set("channel", str(self.channel))
        if self.key is not None:
            target_elem.set("key", str(self.key))
        if self.controller is not None:
            target_elem.set("controller", str(self.controller))
        return target_elem

    @classmethod
    def from_xml(cls, element):
        parameter = element.get("parameter")
        expression = element.get("expression")
        channel = element.get("channel")
        channel = int(channel) if channel else None
        key = element.get("key")
        key = int(key) if key else None
        controller = element.get("controller")
        controller = int(controller) if controller else None
        return cls(parameter, expression, channel, key, controller)
