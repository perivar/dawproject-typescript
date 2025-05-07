from lxml import etree as ET
from classes.lane import Lane
from classes.realParameter import RealParameter
from classes.boolParameter import BoolParameter
from classes.device import Device


class Channel(Lane):
    def __init__(
        self,
        role=None,
        audio_channels=2,
        volume=None,
        pan=None,
        mute=None,
        solo=None,
        destination=None,
        sends=None,
        devices=None,
        name=None,
        color=None,
        comment=None,
    ):
        super().__init__(name, color, comment)
        self.role = role
        self.audio_channels = audio_channels
        self.volume = volume
        self.pan = pan
        self.mute = mute
        self.solo = solo
        self.destination = destination
        self.sends = sends if sends else []
        self.devices = devices if devices else []

    def to_xml(self):
        # Inherit XML generation from Lane and modify tag
        channel_elem = super().to_xml()
        channel_elem.tag = "Channel"

        # Set attributes for the Channel element
        if self.role is not None:
            channel_elem.set("role", str(self.role))  # Ensure role is a string
        if self.audio_channels is not None:
            channel_elem.set(
                "audioChannels", str(self.audio_channels)
            )  # Convert int to string
        if self.solo is not None:
            channel_elem.set(
                "solo", str(self.solo).lower()
            )  # Convert boolean to lowercase string
        if self.destination:
            channel_elem.set(
                "destination", str(self.destination.id)
            )  # Assuming destination has an id attribute

        # Append complex elements if they exist
        if self.devices:
            devices_elem = ET.SubElement(channel_elem, "Devices")
            for device in self.devices:
                devices_elem.append(device.to_xml())
        if self.mute:
            mute_elem = ET.SubElement(channel_elem, "Mute")
            mute_elem.append(self.mute.to_xml())
        if self.pan:
            pan_elem = ET.SubElement(channel_elem, "Pan")
            pan_elem.set(
                "value", str(self.pan.value) if self.pan.value is not None else ""
            )
            pan_elem.set(
                "unit", str(self.pan.unit.value) if self.pan.unit is not None else ""
            )
        if self.sends:
            sends_elem = ET.SubElement(channel_elem, "Sends")
            for send in self.sends:
                send_elem = ET.SubElement(sends_elem, "Send")
                send_elem.append(send.to_xml())
        if self.volume:
            volume_elem = ET.SubElement(channel_elem, "Volume")
            volume_elem.set(
                "value", str(self.volume.value) if self.volume.value is not None else ""
            )
            volume_elem.set(
                "unit",
                str(self.volume.unit.value) if self.volume.unit is not None else "",
            )

        return channel_elem

    @classmethod
    def from_xml(cls, element):
        from classes.send import Send

        instance = super().from_xml(element)

        instance.role = element.get("role")

        audio_channels = element.get("audioChannels")
        instance.audio_channels = (
            int(audio_channels) if audio_channels is not None else 2
        )

        volume_elem = element.find("Volume")
        instance.volume = (
            RealParameter.from_xml(volume_elem) if volume_elem is not None else None
        )

        pan_elem = element.find("Pan")
        instance.pan = (
            RealParameter.from_xml(pan_elem) if pan_elem is not None else None
        )

        mute_elem = element.find("Mute")
        instance.mute = (
            BoolParameter.from_xml(mute_elem) if mute_elem is not None else None
        )

        solo = element.get("solo")
        instance.solo = solo.lower() == "true" if solo else None

        instance.destination = (
        destination_id = element.get("destination")
            Channel.get_channel_by_id(destination_id)
            if destination_id is not None
            else None
        )

        sends = []
        for send_elem in element.findall(".//Sends/Send"):
            sends.append(Send.from_xml(send_elem))
        instance.sends = sends

        devices = []
        for device_elem in element.findall(".//Devices/*"):
            devices.append(Device.from_xml(device_elem))
        instance.devices = devices

        return instance

    @staticmethod
    def get_channel_by_id(channel_id):
        # Implement logic to retrieve a Channel instance by its ID
        pass
