from rest_framework import serializers
from .models import PurchaseRequest

class PurchaseRequestSerializer(serializers.ModelSerializer):
    # Make certain fields read-only to show related data
    requester_username = serializers.CharField(source='requester.username', read_only=True)
    item_name = serializers.CharField(source='item.name', read_only=True)
    vendor_name = serializers.CharField(source='new_item_vendor.name', read_only=True)

    class Meta:
        model = PurchaseRequest
        fields = [
            'id',
            'item',
            'item_name',
            'requester',
            'requester_username',
            'new_item_name',
            'new_item_vendor',
            'vendor_name',
            'new_item_catalog_number',
            'quantity',
            'notes',
            'status',
            'date_requested',
            'date_approved',
        ]
        # The requester should be automatically set to the current user, not chosen from a list.
        read_only_fields = ('requester',) 