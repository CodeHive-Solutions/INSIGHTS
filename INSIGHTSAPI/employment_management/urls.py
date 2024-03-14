from django.urls import path
from .views import send_employment_certification

urlpatterns = [
    path(
        "send-employment-certification/",
        send_employment_certification,
        name="send-employment-certification",
    )
]