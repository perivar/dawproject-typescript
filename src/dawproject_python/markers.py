from lxml import etree as ET
from classes.timeline import Timeline
from classes.marker import Marker


class Markers(Timeline):
    XML_TAG = "Markers"

    def __init__(
        self,
        markers=None,
        track=None,
        time_unit=None,
        name=None,
        color=None,
        comment=None,
    ):
        super().__init__(track, time_unit, name, color, comment)
        self.markers = markers if markers else []

    def to_xml(self):
        markers_elem = ET.Element(self.XML_TAG)

        if self.time_unit:
            markers_elem.set("timeUnit", str(self.time_unit))
        if self.track:
            markers_elem.set(
                "track", str(self.track.id)
            )  # Assuming track has an id attribute

        for marker in self.markers:
            markers_elem.append(marker.to_xml())

        if self.name:
            markers_elem.set("name", self.name)
        if self.color:
            markers_elem.set("color", self.color)
        if self.comment:
            markers_elem.set("comment", self.comment)

        return markers_elem

    @classmethod
    def from_xml(cls, element):
        instance = super().from_xml(element)

        markers = []
        for marker_elem in element.findall("Marker"):
            markers.append(Marker.from_xml(marker_elem))
        instance.markers = markers

        return instance
