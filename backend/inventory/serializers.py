from rest_framework import serializers
from .models import Location, Category, Vendor, Item, ItemAuditLog

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = '__all__'

# This serializer provides detailed, readable information for an item.
class ItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    vendor_name = serializers.CharField(source='vendor.name', read_only=True)
    added_by_username = serializers.CharField(source='added_by.username', read_only=True)

    class Meta:
        model = Item
        fields = [
            'id', 'name', 'category', 'category_name', 'location', 'location_name', 
            'vendor', 'vendor_name', 'catalog_number', 'quantity', 'units', 
            'stock_warning_threshold', 'expiration_date', 'added_by', 
            'added_by_username', 'date_added', 'last_updated'
        ]