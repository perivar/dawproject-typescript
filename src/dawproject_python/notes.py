from lxml import etree as ET
from classes.timeline import Timeline
from classes.note import Note


class Notes(Timeline):
    XML_TAG = "Notes"

    def __init__(
        self,
        notes=None,
        track=None,
        time_unit=None,
        name=None,
        color=None,
        comment=None,
    ):
        super().__init__(track, time_unit, name, color, comment)
        self.notes = notes if notes else []

    def to_xml(self):
        # Create the Notes XML element
        notes_elem = ET.Element(self.XML_TAG)

        # Set attributes specific to Notes
        if self.time_unit:
            notes_elem.set("timeUnit", str(self.time_unit))
        if self.track:
            notes_elem.set(
                "track", str(self.track.id)
            )  # Assuming track has an id attribute

        # Append child elements for each note
        for note in self.notes:
            notes_elem.append(note.to_xml())

        # Append inherited attributes if available
        if self.name:
            notes_elem.set("name", self.name)
        if self.color:
            notes_elem.set("color", self.color)
        if self.comment:
            notes_elem.set("comment", self.comment)

        return notes_elem

    @classmethod
    def from_xml(cls, element):
        # Initialize using parent class method
        instance = super().from_xml(element)

        # Process child elements of type Note
        notes = []
        for note_elem in element.findall("Note"):
            notes.append(Note.from_xml(note_elem))
        instance.notes = notes

        return instance
