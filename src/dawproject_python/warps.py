from lxml import etree as ET
from classes.timeline import Timeline
from classes.warp import Warp
from classes.timeUnit import TimeUnit


class Warps(Timeline):
    def __init__(self, events=None, content=None, content_time_unit=None, **kwargs):
        super().__init__(**kwargs)  # Inherit from Timeline
        self.events = events if events is not None else []
        self.content = content  # Should be an instance of Timeline or its subclass
        self.content_time_unit = content_time_unit  # Instance of TimeUnit

    def to_xml(self):
        # Create the root element for Warps
        warps_elem = ET.Element("Warps")

        # Append the nested content (e.g., another Timeline)
        if self.content:
            warps_elem.append(self.content.to_xml())

        # Recursively add nested Warp elements
        for warp in self.events:
            warps_elem.append(warp.to_xml())

        # Set contentTimeUnit as an attribute
        if self.content_time_unit:
            warps_elem.set("contentTimeUnit", self.content_time_unit.value)

        return warps_elem

    @classmethod
    def from_xml(cls, element):
        # Parse content (which should be a Timeline or subclass)
        content_elem = element.find("Content")
        content = Timeline.from_xml(content_elem) if content_elem is not None else None

        # Recursively parse nested Warp elements
        events = []
        for warp_elem in element.findall("Warp"):
            events.append(Warp.from_xml(warp_elem))

        # Parse the contentTimeUnit attribute
        content_time_unit = element.get("contentTimeUnit")
        content_time_unit = TimeUnit(content_time_unit) if content_time_unit else None

        return cls(events=events, content=content, content_time_unit=content_time_unit)
