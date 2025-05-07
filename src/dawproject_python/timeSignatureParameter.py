from lxml import etree as ET


class TimeSignatureParameter:
    def __init__(self, numerator=None, denominator=None):
        self.numerator = numerator
        self.denominator = denominator

    def to_xml(self):
        time_signature_elem = ET.Element("TimeSignatureParameter")

        if self.numerator is not None:
            time_signature_elem.set("numerator", str(self.numerator))
        if self.denominator is not None:
            time_signature_elem.set("denominator", str(self.denominator))

        return time_signature_elem

    @classmethod
    def from_xml(cls, element):
        numerator = element.get("numerator")
        numerator = int(numerator) if numerator is not None else None

        denominator = element.get("denominator")
        denominator = int(denominator) if denominator is not None else None

        return cls(numerator, denominator)
