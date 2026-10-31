from rest_framework import serializers
from .models import CustomerProfile


class CustomerProfileSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source='user.username',
        read_only=True
    )

    email = serializers.EmailField(
        source='user.email',
        read_only=True
    )

    phone = serializers.CharField(
        source='user.phone',
        read_only=True
    )

    class Meta:
        model = CustomerProfile
        fields = [
            'id',
            'user',
            'username',
            'email',
            'phone',
            'address',
            'national_id',
            'date_of_birth',
            'created_at',
            'updated_at'
        ]

        read_only_fields = [
            'id',
            'user',
            'username',
            'email',
            'phone',
            'created_at',
            'updated_at'
        ]