from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LocationViewSet, CategoryViewSet, VendorViewSet, ItemViewSet

router = DefaultRouter()
router.register(r'locations', LocationViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'vendors', VendorViewSet)
router.register(r'items', ItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]