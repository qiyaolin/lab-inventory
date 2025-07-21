from django.db import models
from django.conf import settings
# We need to link requests to items in our inventory
from inventory.models import Item, Vendor

class PurchaseRequest(models.Model):
    """
    Represents a request made by a user for an item.
    This is the first step in the procurement process.
    """
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Ordered', 'Ordered'),
    )

    # Links to the item being requested. Can be null if it's a new, non-cataloged item.
    item = models.ForeignKey(Item, on_delete=models.SET_NULL, null=True, blank=True)
    # The user who made the request.
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    # Fields for requesting a new item not yet in inventory
    new_item_name = models.CharField(max_length=200, blank=True)
    new_item_vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True)
    new_item_catalog_number = models.CharField(max_length=100, blank=True)

    quantity = models.PositiveIntegerField(default=1)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    
    # Timestamps
    date_requested = models.DateTimeField(auto_now_add=True)
    date_approved = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        item_name = self.item.name if self.item else self.new_item_name
        return f"Request for {item_name} by {self.requester.username}"
