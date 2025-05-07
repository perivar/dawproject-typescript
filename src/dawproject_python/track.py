from lxml import etree as ET
from classes.lane import Lane
from classes.channel import Channel


class Track(Lane):
    def __init__(
        self,
        content_type=None,
        loaded=None,
        channel=None,
        tracks=None,
        name=None,
        color=None,
        comment=None,
    ):
        super().__init__(name, color, comment)
        self.content_type = content_type if content_type else []
        self.loaded = loaded
        self.channel = channel
        self.tracks = tracks if tracks else []

    def to_xml(self):
        # Inheriting to_xml from Lane and changing tag
        track_elem = super().to_xml()
        track_elem.tag = "Track"

        # Set content_type as an attribute
        if self.content_type:
            content_type_str = ",".join(str(ct.value) for ct in self.content_type)
            track_elem.set("contentType", content_type_str)

        # Set loaded as an attribute, converting to lowercase string for XML
        if self.loaded is not None:
            track_elem.set("loaded", str(self.loaded).lower())

        # Append Channel as a nested XML element if present
        if self.channel:
            channel_elem = ET.SubElement(track_elem, "Channel")
            channel_elem.extend(self.channel.to_xml().getchildren())

        # Recursively add nested tracks
        for track in self.tracks:
            track_elem.append(track.to_xml())

        return track_elem

    @classmethod
    def from_xml(cls, element):
        # Call the superclass method to initialize inherited attributes
        instance = super().from_xml(element)

        # Extract contentType text and split into a list
        content_type_elem = element.find("contentType")
        if content_type_elem is not None and content_type_elem.text:
            instance.content_type = content_type_elem.text.split(",")

        # Parse the loaded attribute, converting 'true'/'false' to Boolean
        loaded = element.get("loaded")
        instance.loaded = loaded.lower() == "true" if loaded else None

        # Initialize channel using Channel's from_xml method if present
        channel_elem = element.find("Channel")
        instance.channel = (
            Channel.from_xml(channel_elem) if channel_elem is not None else None
        )

        # Recursively parse nested Track elements
        tracks = []
        for track_elem in element.findall("Track"):
            tracks.append(Track.from_xml(track_elem))
        instance.tracks = tracks

        return instance
