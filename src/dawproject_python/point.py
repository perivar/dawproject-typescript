from abc import ABC
from lxml import etree as ET
from classes.doubleAdapter import DoubleAdapter


class Point(ABC):
    def __init__(self, time=None):
        self.time = time

    def to_xml(self):
        point_elem = ET.Element(self.__class__.__name__)
        if self.time is not None:
            point_elem.set("time", DoubleAdapter.to_xml(self.time))
        return point_elem

    @classmethod
    def from_xml(cls, element):
        time = element.get("time")
        time = DoubleAdapter.from_xml(time) if time is not None else None
        return cls(time)
