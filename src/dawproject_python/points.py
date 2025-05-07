from lxml import etree as ET
from classes.timeline import Timeline
from classes.automationTarget import AutomationTarget


class Points(Timeline):
    XML_TAG = "Points"

    def __init__(
        self,
        target=None,
        points=None,
        unit=None,
        track=None,
        time_unit=None,
        name=None,
        color=None,
        comment=None,
    ):
        super().__init__(track, time_unit, name, color, comment)
        self.target = target if target else AutomationTarget()
        self.points = points if points else []
        self.unit = unit

    def to_xml(self):
        points_elem = ET.Element(self.XML_TAG)

        if self.time_unit:
            points_elem.set("timeUnit", str(self.time_unit))
        if self.track:
            points_elem.set("track", str(self.track.id))
        if self.unit:
            points_elem.set("unit", self.unit)

        # Create the Target element with attributes directly set
        target_elem = self.target.to_xml()
        points_elem.append(target_elem)

        for point in self.points:
            points_elem.append(point.to_xml())

        if self.name:
            points_elem.set("name", self.name)
        if self.color:
            points_elem.set("color", self.color)
        if self.comment:
            points_elem.set("comment", self.comment)

        return points_elem

    @classmethod
    def from_xml(cls, element):
        instance = super().from_xml(element)

        target_elem = element.find("Target")
        instance.target = (
            AutomationTarget.from_xml(target_elem)
            if target_elem is not None
            else AutomationTarget()
        )

        points = []
        for point_elem in element:
            if point_elem.tag in [
                "Point",
                "RealPoint",
                "EnumPoint",
                "BoolPoint",
                "IntegerPoint",
                "TimeSignaturePoint",
            ]:
                point_class = globals().get(point_elem.tag)
                if point_class:
                    points.append(point_class.from_xml(point_elem))
        instance.points = points

        instance.unit = element.get("unit")

        return instance
