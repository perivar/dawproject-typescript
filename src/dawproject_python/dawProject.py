from lxml import etree as ET
from zipfile import ZipFile
from lxml import etree
from io import StringIO, BytesIO
import chardet

from .project import Project
from .metaData import MetaData
from .application import Application
from .transport import Transport
from .lane import Lane
from .arrangement import Arrangement
from .scene import Scene


FORMAT_NAME = "DAWproject exchange format"
FILE_EXTENSION = "dawproject"

PROJECT_FILE = "project.xml"
METADATA_FILE = "metadata.xml"


class DawProject:
    FORMAT_NAME = "DAWproject exchange format"
    FILE_EXTENSION = "dawproject"
    PROJECT_FILE = "project.xml"
    METADATA_FILE = "metadata.xml"

    @staticmethod
    def export_schema(file, cls):
        try:
            schema_root = etree.Element(
                "xs:schema", nsmap={"xs": "http://www.w3.org/2001/XMLSchema"}
            )
            schema_tree = etree.ElementTree(schema_root)
            with open(file, "wb") as schema_file:
                schema_tree.write(
                    schema_file,
                    pretty_print=True,
                    xml_declaration=True,
                    encoding="UTF-8",
                )
        except Exception as e:
            raise IOError(e)

    @staticmethod
    def to_xml(obj):
        try:
            root = ET.Element(obj.__class__.__name__)
            for key, value in vars(obj).items():
                if isinstance(
                    value, list
                ):  # Handling lists, such as scenes or structure
                    list_elem = ET.SubElement(root, key.capitalize())
                    for item in value:
                        list_elem.append(DawProject.to_xml_element(item))
                elif hasattr(
                    value, "to_xml"
                ):  # Handle nested objects with a to_xml method
                    tag_name = getattr(value, "XML_TAG", value.__class__.__name__)
                    element = value.to_xml()
                    if element.tag != tag_name:  # Only rename if different
                        element.tag = tag_name
                    root.append(value.to_xml())
                else:
                    # Handle simple data types, including attributes
                    if key == "version":  # Assuming version should be an attribute
                        root.set(key, str(value))
                    else:
                        child = ET.SubElement(root, key.capitalize())
                        child.text = str(value) if value is not None else ""
            return ET.tostring(root, encoding="utf-8").decode("utf-8")
        except Exception as e:
            raise IOError(e)

    @staticmethod
    def to_xml_element(obj):
        if hasattr(obj, "to_xml"):
            return obj.to_xml()
        else:
            # Fallback if no to_xml method; consider handling this case appropriately
            element = ET.Element(obj.__class__.__name__)
            for key, value in vars(obj).items():
                child = ET.SubElement(element, key)
                child.text = str(value) if value is not None else ""
            return element

    @staticmethod
    def create_context(cls):
        pass

    @staticmethod
    def from_xml(reader, cls):
        try:
            tree = ET.parse(reader)
            root = tree.getroot()
            obj = cls()
            for child in root:
                setattr(obj, child.tag, child.text)
            return obj
        except Exception as e:
            raise IOError(e)

    @staticmethod
    def save_xml(project, file):
        project_xml = DawProject.to_xml(project)
        with open(file, "wb") as file_out:
            file_out.write(project_xml.encode("utf-8"))

    @staticmethod
    def validate(project):
        try:
            # Convert the project object to an XML string
            project_xml = DawProject.to_xml(project)

            # Load the XML Schema (.xsd file)
            with open("../Project.xsd", "r") as schema_file:
                schema_doc = etree.parse(schema_file)
                schema = etree.XMLSchema(schema_doc)

            # Parse the project XML and validate it against the schema
            xml_doc = etree.parse(StringIO(project_xml))
            schema.assertValid(xml_doc)
            print("Validation successful.")

        except etree.XMLSchemaError as e:
            raise IOError(f"Schema validation error: {e}")
        except Exception as e:
            raise IOError(f"Unexpected error: {e}")

    @staticmethod
    def save(project, metadata, embedded_files, file):
        metadata_xml = DawProject.to_xml(metadata)
        project_xml = DawProject.to_xml(project)
        with ZipFile(file, "w") as zos:
            DawProject.add_to_zip(
                zos, DawProject.METADATA_FILE, metadata_xml.encode("utf-8")
            )
            DawProject.add_to_zip(
                zos, DawProject.PROJECT_FILE, project_xml.encode("utf-8")
            )
            for path, file_path in embedded_files.items():
                DawProject.add_to_zip(zos, file_path, path)

    @staticmethod
    def add_to_zip(zos, path, data):
        with zos.open(path, "w") as entry:
            entry.write(data)

    @staticmethod
    def strip_bom(input_stream):
        data = input_stream.read()
        result = chardet.detect(data)
        encoding = result["encoding"]
        if encoding is None:
            raise IOError("The charset is not supported.")
        return StringIO(data.decode(encoding))

    @staticmethod
    def load_project(file):
        with ZipFile(file, "r") as zip_file:
            project_entry = zip_file.open(DawProject.PROJECT_FILE)
            return DawProject.from_xml(DawProject.strip_bom(project_entry), Project)

    @staticmethod
    def load_metadata(file):
        with ZipFile(file, "r") as zip_file:
            entry = zip_file.open(DawProject.METADATA_FILE)
            return DawProject.from_xml(DawProject.strip_bom(entry), MetaData)

    @staticmethod
    def stream_embedded(file, embedded_path):
        zip_file = ZipFile(file, "r")
        entry = zip_file.open(embedded_path)
        return entry
