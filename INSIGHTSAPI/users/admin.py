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

    readonly_fields = ["username"]

    list_display = (
        upper_case_name,
        "job_position",
        "area",
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
    ordering = ("first_name", "area", "job_position")
    filter_horizontal = (
        "groups",
        "user_permissions",
    )
    fieldsets = (
        (
            "Información personal",
            {"fields": (("first_name", "last_name"), "email")},
        ),
        (
            "Información corporativa",
            {"fields": ("username", ("area", "company_email"), "job_position")},
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
