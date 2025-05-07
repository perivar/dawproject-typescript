from lxml import etree as ET
from classes.fileReference import FileReference
from classes.timeline import Timeline


class MediaFile(Timeline):
    def __init__(self, file=None, duration=0.0, name=None):
        super().__init__(name)  # Call the base class (Timeline) constructor
        self.file = (
            file if file else FileReference()
        )  # Ensure file is a FileReference instance
        self.duration = duration

    def to_xml(self):
        # The tag name will be determined by the subclass, e.g., "Audio", "Video"
        media_elem = ET.Element(
            "MediaFile"
        )  # Placeholder, should be overridden by subclass

        # Add the File element
        file_elem = self.file.to_xml()
        file_elem.tag = "File"  # Ensure the tag is "File"
        media_elem.append(file_elem)

        # Set the duration attribute
        media_elem.set("duration", str(self.duration))

        return media_elem

    @classmethod
    def from_xml(cls, element):
        # Parse the File element
        file_elem = element.find("File")
        file = (
            FileReference.from_xml(file_elem)
            if file_elem is not None
            else FileReference()
        )

        # Parse the duration attribute
        duration = float(element.get("duration", 0.0))

        # Optional name attribute from Timeline
        name = element.get("name")

        return cls(file=file, duration=duration, name=name)
