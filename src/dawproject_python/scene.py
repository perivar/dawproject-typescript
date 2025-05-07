from lxml import etree as ET
from classes.referenceable import Referenceable
from classes.timeline import Timeline


class Scene(Referenceable):
    def __init__(self, content=None, name=None, color=None, comment=None):
        super().__init__(name, color, comment)
        self.content = content

    def to_xml(self):
        scene_elem = super().to_xml()
        scene_elem.tag = "Scene"

        if self.content:
            content_elem = ET.SubElement(scene_elem, "Timeline")
            content_elem.append(self.content.to_xml())

        return scene_elem

    @classmethod
    def from_xml(cls, element):
        instance = super().from_xml(element)

        content_elem = element.find("Timeline")
        if content_elem is not None:
            content_class = globals().get(content_elem.tag)
            if content_class and issubclass(content_class, Timeline):
                instance.content = content_class.from_xml(content_elem)

        return instance
