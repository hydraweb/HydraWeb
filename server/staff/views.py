from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes

from .models import Announcement, SystemLog, SystemOperationEnum
from core.utils import StandardResultsSetPagination
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from .serializers import SystemLogSerialzer,StaffAnnouncementSerializer,UserAnnouncementSerializer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

# Create your views here.

class StaffAnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    pagination_class = StandardResultsSetPagination
    permission_classes = (IsAdminUser,)
    serializer_class = StaffAnnouncementSerializer

    def get_queryset(self):
        return self.queryset

    def list(self, request, **kwargs):
        queryset = self.paginate_queryset(self.get_queryset())
        serializer = StaffAnnouncementSerializer(queryset, many=True)
        return self.get_paginated_response(serializer.data)

    def retrive(self, request, pk=None, **kwargs):
        a = get_object_or_404(Announcement, pk=pk)
        serializer = StaffAnnouncementSerializer(data=a)
        serializer.is_valid(raise_exception=True)
        return Response({"status": "ok", "data": serializer.data}, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = StaffAnnouncementSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.create(request.user)
        return Response({"status": "ok", "data": serializer.data}, status=status.HTTP_200_OK)
        
    def patch(self, request, pk=None, **kwargs):
        a = get_object_or_404(Announcement, pk=pk)
        serializer = StaffAnnouncementSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.edit(user=request.user,instance=a)
        return Response({"status": "ok", "data": serializer.data}, status=status.HTTP_200_OK)

    def destory(self, request, pk=None, **kwargs):
        a = get_object_or_404(Announcement, pk=pk)
        serializer = StaffAnnouncementSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.delete(user=request.user,instance=a)

class UserAnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    pagination_class = StandardResultsSetPagination
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return self.queryset

    def list(self, request, **kwargs):
        queryset = self.paginate_queryset(self.get_queryset())
        serializer = UserAnnouncementSerializer(queryset, many=True)
        return self.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_years(request):
    return Response({"status": "ok", "data": SystemLog.objects.get_all_years()}, status=status.HTTP_200_OK)


class SystemLogViewSet(viewsets.ModelViewSet):
    queryset = SystemLog.objects
    pagination_class = StandardResultsSetPagination
    permission_classes = (IsAdminUser,)

    def get_queryset(self):
        queryset = self.queryset
        type = self.request.query_params.get('type', None)
        year = self.request.query_params.get('year', None)
        month = self.request.query_params.get('month', None)

        if year is not None:
            if month is not None:
                queryset = queryset.get_log_by_year_and_month(year=year, month=month)
            else:
                queryset = queryset.get_log_by_year(year=year)

        if type is not None:
            if isinstance(type, str):
                if type == "user_login":
                    queryset = queryset.filter(operation=SystemOperationEnum.USER_LOGIN).all()

        return queryset

    def list(self, request, **kwargs):
        queryset = self.paginate_queryset(self.get_queryset().order_by('-created_at'))
        serializer = SystemLogSerialzer(queryset, many=True)
        return self.get_paginated_response(serializer.data)
