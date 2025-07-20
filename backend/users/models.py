from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.
    This model is the single source of truth for user information.
    """
    ROLE_CHOICES = (
        ('Admin', 'Administrator'),
        ('Manager', 'Lab Manager'),
        ('Researcher', 'Researcher'),
        ('ReadOnly', 'Read-Only'),
    )
    # We add a 'role' field to define user permissions throughout the app.
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Researcher')

    def __str__(self):
        return self.username
