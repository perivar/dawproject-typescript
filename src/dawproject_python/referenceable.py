from classes.nameable import Nameable


class Referenceable(Nameable):
    ID = 0
    _instances = {}

    @classmethod
    def reset_id(cls):
        cls.ID = 0
        cls._instances = {}

    def __init__(self, name=None, color=None, comment=None):
        super().__init__(name, color, comment)
        self.id = f"id{Referenceable.ID}"
        Referenceable._instances[self.id] = self
        Referenceable.ID += 1

    def to_xml(self):
        element = super().to_xml()
        element.set("id", self.id)
        return element

    @classmethod
    def from_xml(cls, element):
        instance = super().from_xml(element)
        instance.id = element.get("id")
        cls._instances[instance.id] = instance
        return instance

    @classmethod
    def get_by_id(cls, id):
        return cls._instances.get(id)
