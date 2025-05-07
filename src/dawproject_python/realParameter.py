from classes.parameter import Parameter
from classes.doubleAdapter import DoubleAdapter
from classes.unit import Unit


class RealParameter(Parameter):
    def __init__(self, value=None, unit=None, min_value=None, max_value=None):
        super().__init__()
        self.value = value
        self.unit = unit
        self.min = min_value
        self.max = max_value

    def to_xml(self):
        param_elem = super().to_xml()
        param_elem.tag = "RealParameter"

        if self.value is not None:
            param_elem.set("value", DoubleAdapter.to_xml(self.value))
        if self.unit is not None:
            param_elem.set("unit", self.unit.name)
        if self.min is not None:
            param_elem.set("min", DoubleAdapter.to_xml(self.min))
        if self.max is not None:
            param_elem.set("max", DoubleAdapter.to_xml(self.max))

        return param_elem

    @classmethod
    def from_xml(cls, element):
        value = DoubleAdapter.from_xml(element.get("value"))
        unit = Unit(element.get("unit"))
        min_value = DoubleAdapter.from_xml(element.get("min"))
        max_value = DoubleAdapter.from_xml(element.get("max"))

        return cls(value=value, unit=unit, min_value=min_value, max_value=max_value)
