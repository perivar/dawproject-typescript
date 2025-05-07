from classes.referenceable import Referenceable


class Parameter(Referenceable):
    def __init__(self, parameter_id=None, name=None, color=None, comment=None):
        super().__init__(name, color, comment)
        self.parameter_id = parameter_id

    def to_xml(self):
        parameter_elem = (
            super().to_xml()
        )  # Call the superclass to_xml to get common attributes
        if self.parameter_id is not None:
            parameter_elem.set(
                "parameterID", str(self.parameter_id)
            )  # Set the parameterID attribute
        return parameter_elem

    @classmethod
    def from_xml(cls, element):
        instance = super().from_xml(element)  # Initialize using the superclass method
        parameter_id = element.get("parameterID")
        instance.parameter_id = int(parameter_id) if parameter_id is not None else None
        return instance
