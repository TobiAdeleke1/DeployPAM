from .models import Location
from rest_framework_gis.serializers import GeoFeatureModelSerializer

class LocationSerializer(GeoFeatureModelSerializer):
    """
    Serializer for the Location model, converting it to GeoJSON format,
    including geometry and bounding box fields.

    Attributes:
        geo_field (str): Specifies the geometry field in the model (`point`).
        bbox_geo_field (str): Specifies the bounding box field in the model (`boundingbox`).
        auto_bbox (bool): Automatically generates a bounding box for the geometry field.

    Meta:
        model (Location): The model to serialize.
        fields (tuple): Fields to include in the serialized output:
            - `id`: The unique identifier of the location.
            - `name`: The name of the location.
            - `display_name`: A descriptive name for the location.
            - `osm_type`: The OpenStreetMap type of the location.
            - `location_type`: The type of location (e.g., city, park, etc.).
            - `category`: The category of the location.    
    """
    class Meta:
        model = Location
        geo_field = "point" 
        bbox_geo_field = "boundingbox"
        fields = ('id', 'name', 'display_name', 'osm_type', 'location_type','category')