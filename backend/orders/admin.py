from django.contrib import admin
from .models import PurchaseRequest

@admin.register(PurchaseRequest)
class PurchaseRequestAdmin(admin.ModelAdmin):
    list_display = [
        'id', 
        'get_item_name', 
        'requester', 
        'quantity', 
        'status', 
        'date_requested'
    ]
    list_filter = ['status', 'date_requested', 'requester']
    search_fields = ['new_item_name', 'requester__username', 'notes']
    readonly_fields = ['date_requested', 'date_approved']
    
    def get_item_name(self, obj):
        return obj.item.name if obj.item else obj.new_item_name
    get_item_name.short_description = 'Item Name'
