"""This file is used to register models to the admin site. """
from django.contrib import admin
from .models import BlogPost


class BlogPostAdmin(admin.ModelAdmin):
    """This class is used to customize the admin site for the blog post model."""

    list_display = ("title", "date_posted")
    search_fields = ("title", "date_posted")
    ordering = ("-date_posted",)

admin.site.register(BlogPost, BlogPostAdmin)
