from lxml import etree as ET
from classes.timeline import Timeline


class Lanes(Timeline):
    XML_TAG = "Lanes"

    def __init__(
        self,
        lanes=None,
        track=None,
        time_unit=None,
        name=None,
        color=None,
        comment=None,
    ):
        super().__init__(track, time_unit, name, color, comment)
        self.lanes = lanes if lanes else []

    def to_xml(self):
        # Create the XML element for Lanes
        lanes_elem = ET.Element(self.XML_TAG)

        # Set attributes specific to Lanes
        if self.time_unit:
            lanes_elem.set("timeUnit", str(self.time_unit.value))
        if self.track:
            lanes_elem.set(
                "track", str(self.track.id)
            )  # Assuming track has an id attribute

        # Append child elements for each lane
        for lane in self.lanes:
            lanes_elem.append(lane.to_xml())

        return lanes_elem

    @classmethod
    def from_xml(cls, element):
        # Initialize instance using the parent class's method
        instance = super().from_xml(element)

        # Process child elements of type Timeline
        lanes = []
        for lane_elem in element.findall(".//Timeline"):
            lane_type = lane_elem.tag
            lane_class = globals().get(lane_type)
            if lane_class and issubclass(lane_class, Timeline):
                lanes.append(lane_class.from_xml(lane_elem))
        instance.lanes = lanes

        return instance
