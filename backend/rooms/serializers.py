
from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):

    class Meta:
        model = Room
        fields = '__all__'
        read_only_fields = (
            'id',
            'created_at',
            'updated_at',
        )

    def validate_price_per_night(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Room price must be greater than zero."
            )
        return value

    def validate_capacity(self, value):
        if value < 1:
            raise serializers.ValidationError(
                "Room capacity must be at least one."
            )
        return value
