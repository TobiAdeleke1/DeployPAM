from django.urls import include, path
from rest_framework import routers

from .views import LocationViewSet

router = routers.DefaultRouter()
router.register(r'locations', LocationViewSet, basename='locations')

urlpatterns = [
    path('', include(router.urls))
]
