from django.contrib.gis.db import models


class Location(models.Model):
    """
    Model representing a geographical location from nomain.

    Attributes:
        name (str): The name of the location.
        display_name (str): A more descriptive name for the location.
        osm_type (str): The OpenStreetMap type of the location (e.g., node, way, relation).
        osm_id (int): The unique OpenStreetMap ID for the location.
        latitude (float): The latitude of the location.
        longitude (float): The longitude of the location.
        category (str): The category of the location (e.g., tourism, amenity).
        location_type (str): The type of location (e.g., city, park, landmark).
        place_rank (int): The rank of the place, indicating its importance or relevance.
        importance (float): A measure of the location's importance.
        addresstype (str): The type of address associated with the location.
        boundingbox (PolygonField): A polygon representing the bounding box of the location.
        point (PointField): A point representing the geographical coordinates of the location.
        created_at (DateTimeField): The timestamp when the location was created.
        updated_at (DateTimeField): The timestamp when the location was last updated.

    Methods:
        __str__(): Returns the display name of the location, or the name if the display name is not set.
    
    """
    name = models.CharField(max_length=100)
    display_name = models.CharField(max_length=250)
    osm_type = models.CharField(max_length=100)
    osm_id = models.BigIntegerField()
    latitude = models.FloatField(blank=False)
    longitude = models.FloatField(blank=False)
    category = models.CharField(max_length=100)
    location_type = models.CharField(max_length=100)
    place_rank = models.IntegerField()
    importance = models.FloatField()
    addresstype = models.CharField(max_length=100)
    boundingbox = models.PolygonField(srid=4326)
    point = models.PointField(srid=4326, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.display_name or self.name