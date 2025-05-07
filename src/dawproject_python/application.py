from lxml import etree as ET


class Application:
    def __init__(self, name=None, version=None):
        self.name = name
        self.version = version

    def to_xml(self):
        application_elem = ET.Element(
            "Application", name=self.name, version=self.version
        )

        if self.name:
            application_elem.set("name", self.name)
        if self.version:
            application_elem.set("version", self.version)

        return application_elem

    @classmethod
    def from_xml(cls, element):
        name = element.get("name")
        version = element.get("version")

        return cls(name, version)
