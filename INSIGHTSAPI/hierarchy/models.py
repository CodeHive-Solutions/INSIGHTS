"""This file contains the models for the hierarchy app. """

from django.db import models


class Area(models.Model):
    """Model for the area"""

    name = models.CharField(max_length=100, unique=True)
    parent = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, related_name="children"
    )
    manager = models.ForeignKey(
        "users.User", on_delete=models.SET_NULL, null=True, related_name="managed_areas"
    )

    def get_children(self):
        """Get all the children of the area."""
        return self.children.all()

    def get_children_managers(self):
        """Get all the managers of the children of the area."""
        return [child.manager for child in self.get_children() if child.manager]

    def get_parents(self):
        """Get all the parents of the area."""
        parents = []
        parent = self.parent
        while parent:
            parents.append(parent)
            parent = parent.parent
        return parents

    def get_parents_managers(self):
        """Get all the managers of the parents of the area."""
        return [parent.manager for parent in self.get_parents() if parent.manager]

    class Meta:
        permissions = [
            ("manage_area", "Can manage the area"),
        ]

    def __str__(self) -> str:
        """String representation of the model."""
        return self.name


class JobPosition(models.Model):
    name = models.CharField(max_length=100, unique=True)
    rank = models.PositiveIntegerField()

    def __str__(self) -> str:
        return self.name
