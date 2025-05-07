from lxml import etree as ET


class Warp:
    def __init__(self, time, content_time):
        self.time = time
        self.content_time = content_time

    def to_xml(self):
        warp_elem = ET.Element("Warp")
        warp_elem.set("time", str(self.time))
        warp_elem.set("contentTime", str(self.content_time))
        return warp_elem

    @classmethod
    def from_xml(cls, element):
        time = float(element.get("time"))
        content_time = float(element.get("contentTime"))
        return cls(time, content_time)
