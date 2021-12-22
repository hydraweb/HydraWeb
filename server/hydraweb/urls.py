from django.urls import path,include
from .views import LayerAPIView, LayerListAPIView, WaterLevelAllStationAPI,WaterLevelAPI,PDFAndPngAPI
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('user/layer', LayerListAPIView.as_view(), name="layer"),
    path('user/water_level/stations', WaterLevelAllStationAPI.as_view(), name="stations"),
    path('user/water_level/getByID', WaterLevelAPI.as_view(), name="getByID"),
    path('user/img', PDFAndPngAPI.as_view(), name="img"),
]