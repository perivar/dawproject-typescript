from classes.point import Point
from classes.doubleAdapter import DoubleAdapter
from classes.interpolation import Interpolation


class RealPoint(Point):
    def __init__(self, time, value, interpolation=None):
        super().__init__(time)
        self.value = value
        self.interpolation = interpolation

    def to_xml(self):
        real_point_elem = super().to_xml()
        real_point_elem.tag = "RealPoint"
        real_point_elem.set("value", DoubleAdapter.to_xml(self.value))
        if self.interpolation is not None:
            real_point_elem.set("interpolation", self.interpolation.value)
        return real_point_elem

    @classmethod
    def from_xml(cls, element):
        instance = super().from_xml(element)
        instance.value = DoubleAdapter.from_xml(element.get("value"))
        interpolation = element.get("interpolation")
        instance.interpolation = Interpolation(interpolation) if interpolation else None
        return instance
