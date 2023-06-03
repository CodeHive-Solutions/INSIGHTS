from django.urls import path
from snippets import views

urlpatterns = [
    path('', views.snippet_list),
    path('<int:pk>/', views.snippet_detail),
]