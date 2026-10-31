
from django.contrib import admin
from .models import Room


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):

    list_display = (
        'room_number',
        'room_type',
        'price_per_night',
        'capacity',
        'status',
    )

    list_filter = (
        'room_type',
        'status',
    )

    search_fields = (
        'room_number',
        'description',
    )

    ordering = ('room_number',)
