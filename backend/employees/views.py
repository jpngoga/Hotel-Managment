from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from rest_framework.filters import SearchFilter

from .models import Employee
from .serializers import EmployeeSerializer


class EmployeeListCreateView(generics.ListCreateAPIView):
    serializer_class = EmployeeSerializer
    permission_classes = [IsAdminUser]

    filter_backends = [SearchFilter]
    search_fields = [
        'full_name',
        'email',
        'phone',
        'position'
    ]

    def get_queryset(self):
        return Employee.objects.all().order_by('-created_at')


class EmployeeDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EmployeeSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Employee.objects.all()