from decimal import Decimal

from django.utils import timezone
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Booking
from .serializers import BookingSerializer


class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Booking.objects.all().order_by('-created_at')

        return Booking.objects.filter(
            customer=user
        ).order_by('-created_at')

    def perform_create(self, serializer):
        room = serializer.validated_data['room']
        check_in = serializer.validated_data['check_in']
        check_out = serializer.validated_data['check_out']

        if check_in < timezone.localdate():
            from rest_framework.exceptions import ValidationError
            raise ValidationError(
                "Check-in date cannot be in the past."
            )

        overlapping_bookings = Booking.objects.filter(
            room=room,
            status__in=[
                Booking.BookingStatus.PENDING,
                Booking.BookingStatus.CONFIRMED
            ],
            check_in__lt=check_out,
            check_out__gt=check_in
        )

        if overlapping_bookings.exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError(
                "This room is already booked for the selected dates."
            )

        number_of_nights = (check_out - check_in).days

        total_price = (
            room.price_per_night * Decimal(number_of_nights)
        )

        serializer.save(
            customer=self.request.user,
            total_price=total_price
        )


class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Booking.objects.all()

        return Booking.objects.filter(customer=user)

    def perform_update(self, serializer):
        from rest_framework.exceptions import ValidationError

        if not self.request.user.is_staff:
            raise ValidationError(
                "Only staff members can update bookings."
            )

        serializer.save()

    def perform_destroy(self, instance):
        if not self.request.user.is_staff:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                "Only staff members can delete bookings."
            )

        instance.delete()