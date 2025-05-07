from lxml import etree as ET
from classes.referenceable import Referenceable
from classes.sendType import SendType
from classes.realParameter import RealParameter


class Send(Referenceable):
    def __init__(
        self,
        volume=None,
        pan=None,
        type=SendType.SendType.POST,
        destination=None,
        name=None,
        color=None,
        comment=None,
    ):
        super().__init__(name, color, comment)
        self.volume = volume
        self.pan = pan
        self.type = type
        self.destination = destination

    def to_xml(self):
        send_elem = super().to_xml()
        send_elem.tag = "Send"

        if self.volume:
            volume_elem = ET.SubElement(send_elem, "Volume")
            volume_elem.append(self.volume.to_xml())
        if self.pan:
            pan_elem = ET.SubElement(send_elem, "Pan")
            pan_elem.append(self.pan.to_xml())
        send_elem.set("type", self.type)
        if self.destination:
            send_elem.set("destination", self.destination.id)

        return send_elem

    @classmethod
    def from_xml(cls, element):
        from classes.channel import Channel

        instance = super().from_xml(element)

        volume_elem = element.find("Volume")
        instance.volume = (
            RealParameter.from_xml(volume_elem) if volume_elem is not None else None
        )

        pan_elem = element.find("Pan")
        instance.pan = (
            RealParameter.from_xml(pan_elem) if pan_elem is not None else None
        )

        instance.type = element.get("type")

        destination_id = element.get("destination")
        instance.destination = (
            Channel.get_channel_by_id(destination_id)
            if destination_id is not None
            else None
        )

        return instance
