from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CustomTokenObtainPairView, logout_view


urlpatterns = [
    path('obtain/', CustomTokenObtainPairView.as_view(), name='obtain_token'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('destroy/', logout_view, name='destroy_token'),
]