from lxml import etree as ET
from classes.doubleAdapter import DoubleAdapter
from classes.timeline import Timeline


class Note:
    def __init__(
        self,
        time,
        duration,
        key,
        channel=0,
        velocity=None,
        release_velocity=None,
        content=None,
    ):
        self.time = time
        self.duration = duration
        self.channel = channel
        self.key = key
        self.velocity = velocity
        self.release_velocity = release_velocity
        self.content = content

    def to_xml(self):
        note_elem = ET.Element("Note")
        note_elem.set("time", DoubleAdapter.to_xml(self.time))
        note_elem.set("duration", DoubleAdapter.to_xml(self.duration))
        note_elem.set("key", str(self.key))

        if self.channel is not None:
            note_elem.set("channel", str(self.channel))
        if self.velocity is not None:
            note_elem.set("vel", DoubleAdapter.to_xml(self.velocity))
        if self.release_velocity is not None:
            note_elem.set("rel", DoubleAdapter.to_xml(self.release_velocity))
        if self.content is not None:
            content_elem = ET.SubElement(note_elem, "Content")
            content_elem.append(self.content.to_xml())

        return note_elem

    @classmethod
    def from_xml(cls, element):
        time = DoubleAdapter.from_xml(element.get("time"))
        duration = DoubleAdapter.from_xml(element.get("duration"))
        key = int(element.get("key"))
        channel = int(element.get("channel")) if element.get("channel") else 0
        velocity = (
            DoubleAdapter.from_xml(element.get("vel")) if element.get("vel") else None
        )
        release_velocity = (
            DoubleAdapter.from_xml(element.get("rel")) if element.get("rel") else None
        )

        content_elem = element.find("Content")
        content = None
        if content_elem is not None:
            content_class = globals().get(content_elem.tag)
            if content_class and issubclass(content_class, Timeline):
                content = content_class.from_xml(content_elem)

        return cls(time, duration, key, channel, velocity, release_velocity, content)
