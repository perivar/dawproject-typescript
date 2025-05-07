from classes.nameable import Nameable


class Marker(Nameable):
    def __init__(self, time, name=None, color=None, comment=None):
        super().__init__(name, color, comment)
        self.time = time

    def to_xml(self):
        marker_elem = super().to_xml()
        marker_elem.tag = "Marker"
        marker_elem.set("time", str(self.time))
        return marker_elem

    @classmethod
    def from_xml(cls, element):
        instance = super().from_xml(element)
        time = element.get("time")
        instance.time = float(time) if time is not None else None
        return instance
