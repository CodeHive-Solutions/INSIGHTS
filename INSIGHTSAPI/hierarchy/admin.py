from django.contrib import admin
from .models import Area, JobPosition


@admin.display(description="Name")
def upper_case_name(obj):
    """Display the user's name in uppercase."""
    if obj.manager:
        return obj.manager.get_full_name() + " - " + obj.manager.job_position.name
    return ""


@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    """Area admin."""

    list_display = (
        "name",
        upper_case_name,
    )
    search_fields = (
        "name",
        "manager__first_name",
        "manager__last_name",
    )
    ordering = ("manager",)


@admin.register(JobPosition)
class JobPositionAdmin(admin.ModelAdmin):
    """Job position admin."""

    list_display = (
        "name",
        "rank",
    )
    search_fields = (
        "name",
        "description",
    )
    ordering = ("-rank",)
