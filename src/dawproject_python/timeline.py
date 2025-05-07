from classes.referenceable import Referenceable


class Timeline(Referenceable):
    def __init__(self, track=None, time_unit=None, name=None, color=None, comment=None):
        super().__init__(name, color, comment)
        self.track = track
        self.time_unit = time_unit

    def to_xml(self):
        raise NotImplementedError("Subclasses should implement this method.")

    @classmethod
    def from_xml(cls, element):
        raise NotImplementedError("Subclasses should implement this method.")
