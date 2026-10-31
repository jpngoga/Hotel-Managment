from django.contrib import admin
from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'full_name',
        'email',
        'phone',
        'position',
        'salary',
        'hire_date',
        'employment_status'
    )

    list_filter = (
        'position',
        'employment_status',
        'hire_date'
    )

    search_fields = (
        'full_name',
        'email',
        'phone',
        'position'
    )

    ordering = ('-created_at',)