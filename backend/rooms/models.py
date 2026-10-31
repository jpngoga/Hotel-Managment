
from django.db import models


class Room(models.Model):

    class RoomType(models.TextChoices):
        SINGLE = 'SINGLE', 'Single'
        DOUBLE = 'DOUBLE', 'Double'
        DELUXE = 'DELUXE', 'Deluxe'
        SUITE = 'SUITE', 'Suite'

    class RoomStatus(models.TextChoices):
        AVAILABLE = 'AVAILABLE', 'Available'
        MAINTENANCE = 'MAINTENANCE', 'Under Maintenance'

    room_number = models.CharField(
        max_length=20,
        unique=True
    )

    room_type = models.CharField(
        max_length=20,
        choices=RoomType.choices
    )

    description = models.TextField()

    price_per_night = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    capacity = models.PositiveIntegerField()

    amenities = models.TextField(
        blank=True,
        help_text="Example: WiFi, TV, Air Conditioning"
    )

    image = models.ImageField(
        upload_to='rooms/',
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=RoomStatus.choices,
        default=RoomStatus.AVAILABLE
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Room {self.room_number} - {self.room_type}"
