"""Views for the blog app."""
from rest_framework import viewsets
from services.permissions import CustomGetDjangoModelViewPermissions
from django.shortcuts import render
from .serializers import BlogPostSerializer
from .models import BlogPost


class BlogViewSet(viewsets.ModelViewSet):
    """ViewSet for the BlogPost model."""

    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [CustomGetDjangoModelViewPermissions]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        return render(request, "blog_post.html", {"blog_post": instance})
