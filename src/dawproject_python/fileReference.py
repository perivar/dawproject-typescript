from lxml import etree as ET


class FileReference:
    def __init__(self, path, external=False):
        if path is None:
            raise ValueError("The 'path' attribute is required for FileReference")
        self.path = path
        self.external = external

    def to_xml(self):
        state_elem = ET.Element("State")
        state_elem.set("path", self.path)
        state_elem.set("external", str(self.external).lower())
        return state_elem

    @classmethod
    def from_xml(cls, element):
        path = element.get("path")
        external = element.get("external")
        external = external.lower() == "true" if external else False
        return cls(path, external)
