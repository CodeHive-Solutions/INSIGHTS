"""Views for the quality_notes app."""

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from quality_notes.models import QualityNote