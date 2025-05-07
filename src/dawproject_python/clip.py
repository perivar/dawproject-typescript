from lxml import etree as ET
from classes.nameable import Nameable
from classes.referenceable import Referenceable
from classes.timeline import Timeline
from classes.timeUnit import TimeUnit


class Clip(Nameable):
    def __init__(
        self,
        time,
        duration=None,
        content_time_unit=None,
        play_start=None,
        play_stop=None,
        loop_start=None,
        loop_end=None,
        fade_time_unit=None,
        fade_in_time=None,
        fade_out_time=None,
        content=None,
        reference=None,
        name=None,
        color=None,
        comment=None,
    ):
        super().__init__(name, color, comment)
        self.time = time
        self.duration = duration
        self.content_time_unit = content_time_unit
        self.play_start = play_start
        self.play_stop = play_stop
        self.loop_start = loop_start
        self.loop_end = loop_end
        self.fade_time_unit = fade_time_unit
        self.fade_in_time = fade_in_time
        self.fade_out_time = fade_out_time
        self.content = content
        self.reference = reference

    def to_xml(self):
        # Create the Clip XML element
        clip_elem = ET.Element("Clip")

        # Set common attributes
        clip_elem.set("time", str(self.time))
        if self.duration is not None:
            clip_elem.set("duration", str(self.duration))
        if self.content_time_unit is not None:
            clip_elem.set("contentTimeUnit", self.content_time_unit.value)
        if self.play_start is not None:
            clip_elem.set("playStart", str(self.play_start))
        if self.play_stop is not None:
            clip_elem.set("playStop", str(self.play_stop))
        if self.loop_start is not None:
            clip_elem.set("loopStart", str(self.loop_start))
        if self.loop_end is not None:
            clip_elem.set("loopEnd", str(self.loop_end))
        if self.fade_time_unit is not None:
            clip_elem.set("fadeTimeUnit", self.fade_time_unit.value)
        if self.fade_in_time is not None:
            clip_elem.set("fadeInTime", str(self.fade_in_time))
        if self.fade_out_time is not None:
            clip_elem.set("fadeOutTime", str(self.fade_out_time))

        # Append content if present
        if self.content is not None:
            content_elem = self.content.to_xml()
            clip_elem.append(content_elem)

        # Reference handling
        if self.reference is not None:
            clip_elem.set("reference", self.reference.id)

        # Append inherited attributes
        nameable_elem = super().to_xml()
        for key, value in nameable_elem.attrib.items():
            clip_elem.set(key, value)

        return clip_elem

    @classmethod
    def from_xml(cls, element):
        # Initialize using parent class method
        instance = super().from_xml(element)

        # Extract Clip-specific attributes
        instance.time = float(element.get("time"))
        instance.duration = (
            float(element.get("duration")) if element.get("duration") else None
        )
        instance.content_time_unit = (
            TimeUnit(element.get("contentTimeUnit"))
            if element.get("contentTimeUnit")
            else None
        )
        instance.play_start = (
            float(element.get("playStart")) if element.get("playStart") else None
        )
        instance.play_stop = (
            float(element.get("playStop")) if element.get("playStop") else None
        )
        instance.loop_start = (
            float(element.get("loopStart")) if element.get("loopStart") else None
        )
        instance.loop_end = (
            float(element.get("loopEnd")) if element.get("loopEnd") else None
        )
        instance.fade_time_unit = (
            TimeUnit(element.get("fadeTimeUnit"))
            if element.get("fadeTimeUnit")
            else None
        )
        instance.fade_in_time = (
            float(element.get("fadeInTime")) if element.get("fadeInTime") else None
        )
        instance.fade_out_time = (
            float(element.get("fadeOutTime")) if element.get("fadeOutTime") else None
        )

        # Handling content and reference
        content_elem = element.find("Timeline")
        if content_elem is not None:
            content_class = globals().get(content_elem.tag)
            if content_class and issubclass(content_class, Timeline):
                instance.content = content_class.from_xml(content_elem)

        reference_id = element.get("reference")
        if reference_id:
            instance.reference = Referenceable.get_by_id(reference_id)

        return instance
