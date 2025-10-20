from django.contrib.gis.geos import Polygon, Point


def nominatim_bbox_to_polygon(boundingbox):
    south, north, west, east = boundingbox
    poly = Polygon.from_bbox((west, south, east, north))
    poly.srid = 4326
    return poly

def nominatim_lat_lot_to_point(lat, lon):
    point = Point(float(lon), float(lat))
    point.srid = 4326
    return point