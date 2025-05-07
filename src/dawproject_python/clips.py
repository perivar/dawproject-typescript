from lxml import etree as ET
from classes.timeline import Timeline
from classes.clip import Clip


class Clips(Timeline):
    XML_TAG = "Clips"

    def __init__(
        self,
        clips=None,
        track=None,
        time_unit=None,
        name=None,
        color=None,
        comment=None,
    ):
        super().__init__(track, time_unit, name, color, comment)
        self.clips = clips if clips else []

    def to_xml(self):
        # Create the XML element for Clips
        clips_elem = ET.Element(self.XML_TAG)

        # Set attributes specific to Clips
        if self.time_unit:
            clips_elem.set("timeUnit", str(self.time_unit))
        if self.track:
            clips_elem.set(
                "track", str(self.track.id)
            )  # Assuming track has an id attribute

        # Append child elements for each clip
        for clip in self.clips:
            clips_elem.append(clip.to_xml())

        return clips_elem

    @classmethod
    def from_xml(cls, element):
        # Initialize instance using the parent class's method
        instance = super().from_xml(element)

        # Process child elements of type Clip
        clips = []
        for clip_elem in element.findall("Clip"):
            clips.append(Clip.from_xml(clip_elem))
        instance.clips = clips

        return instance
