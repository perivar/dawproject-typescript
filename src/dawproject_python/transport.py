from lxml import etree as ET
from classes.realParameter import RealParameter
from classes.timeSignatureParameter import TimeSignatureParameter
from classes.unit import Unit


class Transport:
    def __init__(self, tempo=None, time_signature=None):
        self.tempo = tempo
        self.time_signature = time_signature

    def to_xml(self):
        transport_elem = ET.Element("Transport")

        if self.tempo:
            tempo_elem = ET.SubElement(transport_elem, "Tempo")
            # Assuming self.tempo is an instance of RealParameter with attributes id, value, unit
            tempo_elem.set("id", self.tempo.id)
            tempo_elem.set("value", str(self.tempo.value))
            tempo_elem.set("unit", Unit.BPM.value)

        if self.time_signature:
            time_signature_elem = ET.SubElement(transport_elem, "TimeSignature")
            time_signature_elem.append(self.time_signature.to_xml())

        return transport_elem

    @classmethod
    def from_xml(cls, element):
        tempo_elem = element.find("Tempo")
        tempo = RealParameter.from_xml(tempo_elem) if tempo_elem is not None else None

        time_signature_elem = element.find("TimeSignature")
        time_signature = (
            TimeSignatureParameter.from_xml(time_signature_elem)
            if time_signature_elem is not None
            else None
        )

        return cls(tempo, time_signature)
