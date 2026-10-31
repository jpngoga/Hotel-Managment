from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from rest_framework.filters import SearchFilter

from .models import CustomerProfile
from .serializers import CustomerProfileSerializer


class CustomerListView(generics.ListAPIView):
    serializer_class = CustomerProfileSerializer
    permission_classes = [IsAdminUser]

    filter_backends = [SearchFilter]
    search_fields = [
        'user__username',
        'user__email',
        'national_id'
    ]

    def get_queryset(self):
        return CustomerProfile.objects.select_related(
            'user'
        ).order_by('-created_at')


class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CustomerProfileSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return CustomerProfile.objects.select_related('user')