from rest_framework import viewsets, permissions
from .models import Location, Category, Vendor, Item, ItemAuditLog
from .serializers import (
    LocationSerializer, 
    CategorySerializer, 
    VendorSerializer, 
    ItemSerializer,
    ItemAuditLogSerializer
)

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
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        item = serializer.save(added_by=self.request.user)
        ItemAuditLog.objects.create(
            item=item,
            user=self.request.user,
            action="Created",
            quantity_change=item.quantity,
            notes=f"Item '{item.name}' created with initial quantity {item.quantity} {item.units}"
        )

    def perform_update(self, serializer):
        original_quantity = serializer.instance.quantity
        updated_item = serializer.save()
        quantity_change = updated_item.quantity - original_quantity

        ItemAuditLog.objects.create(
            item=updated_item,
            user=self.request.user,
            action="Updated",
            quantity_change=quantity_change,
            notes=f"Quantity changed from {original_quantity} to {updated_item.quantity}"
        )

    def perform_destroy(self, instance):
        ItemAuditLog.objects.create(
            item=instance,
            user=self.request.user,
            action="Deleted",
            quantity_change=-instance.quantity,
            notes=f"Item '{instance.name}' deleted"
        )
        instance.delete()

class ItemAuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ItemAuditLog.objects.all()
    serializer_class = ItemAuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filter logs by the item ID provided in the URL
        item_pk = self.kwargs.get('item_pk')
        if item_pk:
            return self.queryset.filter(item__pk=item_pk).order_by('-timestamp')
        return self.queryset.none()
