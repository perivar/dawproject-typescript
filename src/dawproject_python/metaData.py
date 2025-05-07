from lxml import etree as ET


class MetaData:
    def __init__(
        self,
        title=None,
        artist=None,
        album=None,
        original_artist=None,
        composer=None,
        songwriter=None,
        producer=None,
        arranger=None,
        year=None,
        genre=None,
        copyright=None,
        website=None,
        comment=None,
    ):
        self.title = title
        self.artist = artist
        self.album = album
        self.original_artist = original_artist
        self.composer = composer
        self.songwriter = songwriter
        self.producer = producer
        self.arranger = arranger
        self.year = year
        self.genre = genre
        self.copyright = copyright
        self.website = website
        self.comment = comment

    def to_xml(self):
        root = ET.Element("MetaData")

        if self.title:
            title_elem = ET.SubElement(root, "Title")
            title_elem.text = self.title
        if self.artist:
            artist_elem = ET.SubElement(root, "Artist")
            artist_elem.text = self.artist
        if self.album:
            album_elem = ET.SubElement(root, "Album")
            album_elem.text = self.album
        if self.original_artist:
            original_artist_elem = ET.SubElement(root, "OriginalArtist")
            original_artist_elem.text = self.original_artist
        if self.composer:
            composer_elem = ET.SubElement(root, "Composer")
            composer_elem.text = self.composer
        if self.songwriter:
            songwriter_elem = ET.SubElement(root, "Songwriter")
            songwriter_elem.text = self.songwriter
        if self.producer:
            producer_elem = ET.SubElement(root, "Producer")
            producer_elem.text = self.producer
        if self.arranger:
            arranger_elem = ET.SubElement(root, "Arranger")
            arranger_elem.text = self.arranger
        if self.year:
            year_elem = ET.SubElement(root, "Year")
            year_elem.text = self.year
        if self.genre:
            genre_elem = ET.SubElement(root, "Genre")
            genre_elem.text = self.genre
        if self.copyright:
            copyright_elem = ET.SubElement(root, "Copyright")
            copyright_elem.text = self.copyright
        if self.website:
            website_elem = ET.SubElement(root, "Website")
            website_elem.text = self.website
        if self.comment:
            comment_elem = ET.SubElement(root, "Comment")
            comment_elem.text = self.comment

        return root

    @classmethod
    def from_xml(cls, element):
        title = element.findtext("Title")
        artist = element.findtext("Artist")
        album = element.findtext("Album")
        original_artist = element.findtext("OriginalArtist")
        composer = element.findtext("Composer")
        songwriter = element.findtext("Songwriter")
        producer = element.findtext("Producer")
        arranger = element.findtext("Arranger")
        year = element.findtext("Year")
        genre = element.findtext("Genre")
        copyright = element.findtext("Copyright")
        website = element.findtext("Website")
        comment = element.findtext("Comment")

        return cls(
            title,
            artist,
            album,
            original_artist,
            composer,
            songwriter,
            producer,
            arranger,
            year,
            genre,
            copyright,
            website,
            comment,
        )
