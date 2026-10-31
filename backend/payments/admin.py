from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'booking',
        'amount',
        'payment_method',
        'status',
        'payment_date',
        'created_at'
    )

    list_filter = (
        'payment_method',
        'status',
        'payment_date'
    )

    search_fields = (
        'booking__id',
        'transaction_reference'
    )

    ordering = ('-created_at',)