
from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):

    booking_id = serializers.IntegerField(
        source='booking.id',
        read_only=True
    )

    class Meta:
        model = Payment

        fields = [
            'id',
            'booking',
            'booking_id',
            'amount',
            'payment_method',
            'status',
            'transaction_reference',
            'payment_date',
            'created_at',
            'updated_at'
        ]

        read_only_fields = [
            'id',
            'booking_id',
            'created_at',
            'updated_at'
        ]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Payment amount must be greater than zero."
            )

        return value
