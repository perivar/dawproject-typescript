from classes.mediaFile import MediaFile
from lxml import etree as ET
from classes.fileReference import FileReference
from classes.timeUnit import TimeUnit


class Audio(MediaFile):
    def __init__(
        self,
        sample_rate,
        channels,
        duration,
        algorithm=None,
        file=None,
        name=None,
        time_unit="seconds",
    ):
        super().__init__(file=file, duration=duration, name=name)
        self.sample_rate = sample_rate
        self.channels = channels
        self.algorithm = algorithm
        self.time_unit = time_unit

    def to_xml(self):
        # Create the root element specifically as "Audio"
        audio_elem = ET.Element("Audio")

        # Call MediaFile's to_xml to add the common elements and attributes
        file_elem = self.file.to_xml()
        file_elem.tag = "File"
        audio_elem.append(file_elem)

        audio_elem.set("duration", str(self.duration))

        # Set Audio-specific attributes
        audio_elem.set("sampleRate", str(self.sample_rate))
        audio_elem.set("channels", str(self.channels))
        if self.algorithm:
            audio_elem.set("algorithm", self.algorithm)
        # Convert time_unit to a string if it's an instance of a class
        if isinstance(self.time_unit, TimeUnit):
            audio_elem.set(
                "timeUnit", str(self.time_unit.value)
            )  # Assuming 'value' is the correct attribute
        else:
            audio_elem.set(
                "timeUnit", str(self.time_unit)
            )  # Directly use if it's already a string

        return audio_elem

    @classmethod
    def from_xml(cls, element):
        sample_rate = int(element.get("sampleRate"))
        channels = int(element.get("channels"))
        algorithm = element.get("algorithm")
        file_elem = element.find("File")
        file = (
            FileReference.from_xml(file_elem)
            if file_elem is not None
            else FileReference()
        )
        duration = float(element.get("duration"))
        time_unit = element.get("timeUnit", "seconds")
        return cls(
            sample_rate,
            channels,
            duration,
            algorithm=algorithm,
            file=file,
            time_unit=time_unit,
        )
