
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import Room
from .serializers import RoomSerializer


class RoomListCreateView(generics.ListCreateAPIView):

    serializer_class = RoomSerializer

    def get_queryset(self):
        queryset = Room.objects.all().order_by('room_number')

        room_type = self.request.query_params.get('room_type')
        status = self.request.query_params.get('status')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        capacity = self.request.query_params.get('capacity')

        if room_type:
            queryset = queryset.filter(room_type=room_type.upper())

        if status:
            queryset = queryset.filter(status=status.upper())

        if min_price:
            queryset = queryset.filter(
                price_per_night__gte=min_price
            )

        if max_price:
            queryset = queryset.filter(
                price_per_night__lte=max_price
            )

        if capacity:
            queryset = queryset.filter(capacity__gte=capacity)

        return queryset

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser()]

        return [AllowAny()]


class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdminUser()]

        return [AllowAny()]
