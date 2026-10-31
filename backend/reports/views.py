from django.db import models

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser



from accounts.models import User
from rooms.models import Room
from bookings.models import Booking
from customers.models import CustomerProfile
from employees.models import Employee
from payments.models import Payment


class DashboardReportView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        report = {
            "total_customers": CustomerProfile.objects.count(),

            "total_employees": Employee.objects.count(),

            "total_rooms": Room.objects.count(),

            "available_rooms": Room.objects.filter(
                status=Room.RoomStatus.AVAILABLE
            ).count(),

            "total_bookings": Booking.objects.count(),

            "pending_bookings": Booking.objects.filter(
                status=Booking.BookingStatus.PENDING
            ).count(),

            "confirmed_bookings": Booking.objects.filter(
                status=Booking.BookingStatus.CONFIRMED
            ).count(),

            "cancelled_bookings": Booking.objects.filter(
                status=Booking.BookingStatus.CANCELLED
            ).count(),

            "total_payments": Payment.objects.count(),

            "completed_payments": Payment.objects.filter(
                status=Payment.PaymentStatus.COMPLETED
            ).count(),

            "total_revenue": Payment.objects.filter(
                status=Payment.PaymentStatus.COMPLETED
            ).aggregate(
                total=models.Sum('amount')
            )['total'] or 0,
        }

        return Response(report)