from rest_framework import viewsets, permissions
from .models import Location, Category, Vendor, Item
from .serializers import LocationSerializer, CategorySerializer, VendorSerializer, ItemSerializer

class IsAdminOrManager(permissions.BasePermission):
    """
    Custom permission to only allow Admins or Lab Managers to edit objects.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and (request.user.role in ['Admin', 'Manager'])

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAdminOrManager]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrManager]

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [IsAdminOrManager]

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.select_related('category', 'location', 'vendor', 'added_by').all()
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated] # All authenticated users can interact

    def perform_create(self, serializer):
        # Automatically set the 'added_by' field to the current user.
        serializer.save(added_by=self.request.user)
