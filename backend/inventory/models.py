from django.db import models
from django.conf import settings

# A self-referencing model for hierarchical storage locations.
class Location(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Vendor(models.Model):
    name = models.CharField(max_length=100, unique=True)
    website = models.URLField(blank=True)

    def __str__(self):
        return self.name

# The core model for every item in the lab inventory.
class Item(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True)
    
    catalog_number = models.CharField(max_length=100, blank=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    units = models.CharField(max_length=50, help_text="e.g., mL, g, kg, units, kits")
    
    stock_warning_threshold = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    expiration_date = models.DateField(null=True, blank=True)
    
    added_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='items_added', on_delete=models.SET_NULL, null=True)
    date_added = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

# A model to track every change to an item's quantity.
class ItemAuditLog(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='audit_logs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=50) # e.g., "Add", "Remove", "Update"
    quantity_change = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.item.name} - {self.action} by {self.user.username}"
