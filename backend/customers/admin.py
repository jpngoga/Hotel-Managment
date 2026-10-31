from django.contrib import admin
from .models import CustomerProfile


@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'user',
        'national_id',
        'date_of_birth',
        'created_at'
    )

    search_fields = (
        'user__username',
        'user__email',
        'national_id'
    )

    list_filter = (
        'date_of_birth',
        'created_at'
    )

    ordering = ('-created_at',)