"""
URL configuration for INSIGHTSAPI project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import include, path
from django.contrib import admin
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


urlpatterns = [
    path("api/schema/download", SpectacularAPIView.as_view(), name="schema"),
    path(
        "documentation/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path("goals/", include("goals.urls")),
    path("token/", include("api_token.urls")),
    path("files/", include("excels_processing.urls")),
    path("sgc/", include("sgc.urls")),
    path("pqrs/", include("pqrs.urls")),
    path("services/", include("services.urls")),
    path("contracts/", include("contracts.urls")),
    path("blog/", include("blog.urls")),
    path("admin/", admin.site.urls),
    path("vacancy/", include("vacancy.urls")),
    path("operational-risk/", include("operational_risk.urls")),
    path("payslips/", include("payslip.urls")),
    path("employment-management/", include("employment_management.urls")),
    path("users/", include("users.urls")),
]

handler500 = "rest_framework.exceptions.server_error"
handler400 = "rest_framework.exceptions.bad_request"
