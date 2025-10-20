from .models import Location
from .serializers import LocationSerializer
from utils.geo_covert import nominatim_lat_lot_to_point, nominatim_bbox_to_polygon
from utils.overpass_api import send_overpass_node_amentity_query, send_overpass_node_amentity_query_radius

from rest_framework import mixins, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response


class LocationViewSet(mixins.ListModelMixin,
                      mixins.RetrieveModelMixin,
                      viewsets.GenericViewSet):
    """
    ViewSet for managing Location instances, providing the standard actions
    (list, create, retrieve, update, delete) for the `Location` model.
    It also includes custom actions for interacting with
    external APIs such as Ticketmaster Discovery and OpenStreetMap Overpass.

    Attributes:
        queryset (QuerySet): The queryset of `Location` objects to be used.
        serializer_class (Serializer): The serializer class for `Location` objects.

    """
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    
    @action(detail=False, methods=['post'], url_path='new')
    def new_location(self, request):
        payload = request.data
    
        # Using point as the unique
        clean_point = nominatim_lat_lot_to_point(
            payload['lat'],
            payload['lon']
        )
        clean_bbox = nominatim_bbox_to_polygon(
            payload['boundingbox']
        ) 

        location = (self.get_queryset()
                    .filter(osm_id=payload['osm_id'])
                    .filter(osm_type=payload['osm_type'])
                )
        if not location:
            location_obj = Location.objects.create(
                name=payload['name'],
                display_name=payload['display_name'],
                osm_id=payload['osm_id'],
                osm_type=payload['osm_type'],
                latitude=payload['lat'],
                longitude=payload['lon'],
                point=clean_point,
                boundingbox=clean_bbox,
                category=payload['category'],
                location_type=payload['type'],
                place_rank=payload['place_rank'],
                importance=payload['importance'],
                addresstype=payload['addresstype']
            )
        else:
            location_obj = location.first()
        
        serializer = self.get_serializer(location_obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='overpass_detail')
    def open_street_maps_overpass(self, request, pk=None):
        location_id = request.query_params.get('location_id', None)

        if not location_id:
            return Response(
                {'error': 'No valid Location added'},
                  status=status.HTTP_400_BAD_REQUEST)
        
        location = self.get_queryset().filter(id=location_id).first()
        west, south, east, north = location.boundingbox.extent
        
        latitude = location.latitude
        longitude = location.longitude
      
        overpass_response = send_overpass_node_amentity_query_radius(
            latitude,
            longitude,
            1000
        )
     
   
        return Response({'amenity_nodes':overpass_response,
                         'point': [latitude, longitude],
                         'bbox': [south, north, west, east]},
                          status=status.HTTP_200_OK)

