from lxml import etree as ET
from classes.application import Application
from classes.transport import Transport
from classes.lane import Lane
from classes.arrangement import Arrangement
from classes.scene import Scene


class Project:
    CURRENT_VERSION = "1.0"

    def __init__(
        self,
        version=None,
        application=None,
        transport=None,
        structure=None,
        arrangement=None,
        scenes=None,
    ):
        self.version = version if version else self.CURRENT_VERSION
        self.application = application if application else Application()
        self.transport = transport
        self.structure = structure if structure else []
        self.arrangement = arrangement
        self.scenes = scenes if scenes else []

    def to_xml(self):
        root = ET.Element("Project", version=self.version)
        print(f"Creating XML for Project with version: {self.version}")

        # Correctly handling Application element with attributes
        app_elem = self.application.to_xml()
        root.append(app_elem)
        print("Added Application element.")

        if self.transport:
            transport_elem = ET.SubElement(root, "Transport")
            transport_elem.append(self.transport.to_xml())
            print("Added Transport element.")

        if self.structure:
            structure_elem = ET.SubElement(root, "Structure")
            for lane in self.structure:
                structure_elem.append(lane.to_xml())
            print("Added Structure element with lanes.")

        if self.arrangement:
            arrangement_elem = ET.SubElement(root, "Arrangement")
            arrangement_elem.append(self.arrangement.to_xml())
            print("Added Arrangement element.")

        if self.scenes:
            scenes_elem = ET.SubElement(root, "Scenes")
            for scene in self.scenes:
                scene_elem = ET.SubElement(scenes_elem, "Scene")
                scene_elem.append(scene.to_xml())
            print("Added Scenes element with scenes.")

        return root

    @classmethod
    def from_xml(cls, element):
        version = element.get("version", cls.CURRENT_VERSION)
        application = Application.from_xml(element.find("Application"))
        transport_elem = element.find("Transport")
        transport = (
            Transport.from_xml(transport_elem) if transport_elem is not None else None
        )

        structure_elem = element.find("Structure")
        structure = (
            [Lane.from_xml(lane) for lane in structure_elem]
            if structure_elem is not None
            else []
        )

        arrangement_elem = element.find("Arrangement")
        arrangement = (
            Arrangement.from_xml(arrangement_elem)
            if arrangement_elem is not None
            else None
        )

        scenes_elem = element.find("Scenes")
        scenes = (
            [Scene.from_xml(scene) for scene in scenes_elem]
            if scenes_elem is not None
            else []
        )

        return cls(version, application, transport, structure, arrangement, scenes)
