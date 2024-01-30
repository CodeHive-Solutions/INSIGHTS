from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.display(description="Name")
def upper_case_name(obj):
    """Display the user's name in uppercase."""
    return obj.get_full_name()


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Custom user admin."""

    readonly_fields = ["username", "job_title", "area"]

    list_display = (
        "username",
        upper_case_name,
    )
    list_filter = (
        "is_staff",
        "is_superuser",
        "groups",
    )
    search_fields = (
        "username",
        "first_name",
        "last_name",
    )
    ordering = ("username",)
    filter_horizontal = (
        "groups",
        "user_permissions",
    )
    fieldsets = (
        ("User info", {"fields": ("username", "area", "job_title")}),
        (
            "Información personal",
            {"fields": (("first_name", "last_name"), "email")},
        ),
        (
            "Permisos",
            {
                "fields": (
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
    )
