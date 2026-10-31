
from rest_framework import generics
from rest_framework.permissions import IsAdminUser

from .models import Payment
from .serializers import PaymentSerializer


class PaymentListCreateView(generics.ListCreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Payment.objects.select_related(
            'booking',
            'booking__customer',
            'booking__room'
        ).order_by('-created_at')


class PaymentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Payment.objects.select_related(
            'booking',
            'booking__customer',
            'booking__room'
        )
