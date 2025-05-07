from lxml import etree as ET
from classes.lanes import Lanes
from classes.referenceable import Referenceable
from classes.markers import Markers
from classes.points import Points


class Arrangement(Referenceable):
    def __init__(
        self,
        time_signature_automation=None,
        tempo_automation=None,
        markers=None,
        lanes=None,
    ):
        self.time_signature_automation = time_signature_automation
        self.tempo_automation = tempo_automation
        self.markers = markers
        self.lanes = lanes

    def to_xml(self):
        arrangement_elem = ET.Element("Arrangement")

        if self.time_signature_automation:
            ts_automation_elem = ET.SubElement(
                arrangement_elem, "TimeSignatureAutomation"
            )
            ts_automation_elem.append(self.time_signature_automation.to_xml())
        if self.tempo_automation:
            tempo_automation_elem = ET.SubElement(arrangement_elem, "TempoAutomation")
            tempo_automation_elem.append(self.tempo_automation.to_xml())
        if self.lanes:
            lanes_elem = ET.SubElement(arrangement_elem, "Lanes")
            lanes_elem.append(self.lanes.to_xml())
        if self.markers:
            markers_elem = ET.SubElement(arrangement_elem, "Markers")
            for marker in self.markers.markers:
                markers_elem.append(marker.to_xml())

        return arrangement_elem

    @classmethod
    def from_xml(cls, element):
        ts_automation_elem = element.find("TimeSignatureAutomation")
        time_signature_automation = (
            Points.from_xml(ts_automation_elem)
            if ts_automation_elem is not None
            else None
        )

        tempo_automation_elem = element.find("TempoAutomation")
        tempo_automation = (
            Points.from_xml(tempo_automation_elem)
            if tempo_automation_elem is not None
            else None
        )

        markers_elem = element.find("Markers")
        markers = Markers.from_xml(markers_elem) if markers_elem is not None else None

        lanes_elem = element.find("Lanes")
        lanes = Lanes.from_xml(lanes_elem) if lanes_elem is not None else None

        return cls(time_signature_automation, tempo_automation, markers, lanes)
