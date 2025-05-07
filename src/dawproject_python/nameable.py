from abc import ABC
from lxml import etree as ET


class Nameable(ABC):
    def __init__(self, name=None, color=None, comment=None):
        self.name = name
        self.color = color
        self.comment = comment

    def to_xml(self):
        element = ET.Element(self.__class__.__name__)

        if self.name is not None:
            element.set("name", self.name)
        if self.color is not None:
            element.set("color", self.color)
        if self.comment is not None:
            element.set("comment", self.comment)

        return element

    @classmethod
    def from_xml(cls, element):
        name = element.get("name")
        color = element.get("color")
        comment = element.get("comment")

        return cls(name, color, comment)
