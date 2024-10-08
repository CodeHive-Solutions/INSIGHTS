from django.contrib import admin
from django.db.models import Q

from users.models import User

from .models import Area, JobPosition


@admin.display(description="Manager", ordering="manager__first_name")
def upper_case_name(obj):
    """Display the user's name in uppercase."""
    if obj.manager:
        return obj.manager.get_full_name() + " - " + obj.manager.job_position.name
    return ""


class ChildAreaInline(admin.TabularInline):
    """Inline admin for displaying child areas."""

    model = Area
    fk_name = "parent"  # Specifies that the parent field links the child areas
    extra = 0  # No extra empty forms in the inline by default
    max_num = 0  # Do not allow adding more child areas
    fields = ("name", "manager")  # Fields to display for the child areas
    readonly_fields = ("name", "manager")  # Make these fields read-only
    show_change_link = True  # Show a link to the child area's change page
    can_delete = False  # Do not allow deleting child areas from the parent area
    ordering = ("name",)  # Order the child areas by name


@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    """Area admin."""

    list_display = ("name", upper_case_name, "parent")
    search_fields = (
        "name",
        "manager__first_name",
        "manager__last_name",
    )
    ordering = ("name",)
    inlines = [ChildAreaInline]

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """Customize the queryset for the manager field."""
        if db_field.name == "manager":
            # Customizing the queryset to show only users with a rank >= 4 or have the manage_area permission
            kwargs["queryset"] = (
                User.objects.filter(
                    Q(job_position__rank__gte=4)
                    | Q(user_permissions__codename="manage_area")
                )
                .distinct()
                .order_by("first_name")
            )
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(JobPosition)
class JobPositionAdmin(admin.ModelAdmin):
    """Job position admin."""

    list_display = (
        "name",
        "rank",
    )
    search_fields = ("name",)
    ordering = ("-rank",)
