from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(
        source='customer.username',
        read_only=True
    )

    room_number = serializers.CharField(
        source='room.room_number',
        read_only=True
    )

    class Meta:
        model = Booking
        fields = '__all__'

        read_only_fields = (
            'id',
            'customer',
            'total_price',
            'created_at',
            'updated_at'
        )

    def validate(self, data):
        check_in = data.get('check_in')
        check_out = data.get('check_out')
        room = data.get('room')
        number_of_guests = data.get('number_of_guests')

        if check_in and check_out:
            if check_in >= check_out:
                raise serializers.ValidationError(
                    "Check-out date must be after check-in date."
                )

        if room and number_of_guests:
            if number_of_guests > room.capacity:
                raise serializers.ValidationError(
                    "Number of guests exceeds room capacity."
                )

        return data