from django.urls import path
from .views import send_employment_certification, upload_old_certifications, get_employment_certifications

urlpatterns = [
    path(
        "send-employment-certification/",
        send_employment_certification,
        name="send-employment-certification",
    ),
    path(
        "upload-old-certifications/",
        upload_old_certifications,
        name="upload-old-certifications",
    ),
    path(
        "get-employment-certifications/",
        get_employment_certifications,
        name="get-employment-certifications",
    ),
]
