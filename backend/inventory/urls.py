from django.urls import path, include
from rest_framework_nested import routers
from .views import (
    LocationViewSet, 
    CategoryViewSet, 
    VendorViewSet, 
    ItemViewSet,
    ItemAuditLogViewSet
)

router = routers.DefaultRouter()
router.register(r'locations', LocationViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'vendors', VendorViewSet)
router.register(r'items', ItemViewSet)

# Nested router for item history
items_router = routers.NestedSimpleRouter(router, r'items', lookup='item')
items_router.register(r'history', ItemAuditLogViewSet, basename='item-history')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(items_router.urls)),
]