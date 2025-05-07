class DoubleAdapter:
    @staticmethod
    def to_xml(value: float) -> str:
        """
        Converts a float value to a string for XML serialization.
        Handles special cases: float('inf') becomes 'inf', float('-inf') becomes '-inf'.
        """
        if value is None:
            return None
        if value == float("inf"):
            return "inf"
        elif value == float("-inf"):
            return "-inf"
        else:
            return f"{value:.6f}"

    @staticmethod
    def from_xml(value: str) -> float:
        """
        Converts a string from XML to a float value.
        Handles special cases: 'inf' becomes float('inf'), '-inf' becomes float('-inf').
        """
        if value is None or value in ("null", ""):
            return None
        if value == "inf":
            return float("inf")
        elif value == "-inf":
            return float("-inf")
        else:
            return float(value)
