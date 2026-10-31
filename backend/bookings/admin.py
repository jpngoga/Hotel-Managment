from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'customer',
        'room',
        'check_in',
        'check_out',
        'total_price',
        'status'
    )

    list_filter = ('status', 'check_in', 'check_out')

    search_fields = (
        'customer__username',
        'room__room_number'
    )

    ordering = ('-created_at',)