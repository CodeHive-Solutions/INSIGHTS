"""Permissions for the API"""
from rest_framework import permissions


class CustomGetDjangoModelViewPermissions(permissions.DjangoModelPermissions):
    """
    Similar to DjangoModelPermissions, but also checks for 'view' permission.
    """

    perms_map = {
        "GET": ["%(app_label)s.view_%(model_name)s"],
        "OPTIONS": [],
        "HEAD": [],
        "POST": ["%(app_label)s.add_%(model_name)s"],
        "PUT": ["%(app_label)s.change_%(model_name)s"],
        "PATCH": ["%(app_label)s.change_%(model_name)s"],
        "DELETE": ["%(app_label)s.delete_%(model_name)s"],
    }


class DjangoModelViewPermissionsJustCreate(permissions.DjangoModelPermissions):
    """
    Similar to DjangoModelPermissions, but just allow create.
    """

    perms_map = {
        "POST": ["%(app_label)s.add_%(model_name)s"],
    }


class DjangoModelViewPermissionsNotDelete(permissions.DjangoModelPermissions):
    """
    Similar to DjangoModelPermissions, but not allow delete.
    """

    perms_map = {
        "GET": [],
        "OPTIONS": [],
        "HEAD": [],
        "POST": ["%(app_label)s.add_%(model_name)s"],
        "PUT": ["%(app_label)s.change_%(model_name)s"],
        "PATCH": ["%(app_label)s.change_%(model_name)s"],
    }


class DjangoModelViewPermissionsAllowAllCreate(permissions.DjangoModelPermissions):
    """Allow all the permissions for create"""

    perms_map = {
        "GET": ["%(app_label)s.view_%(model_name)s"],
        "OPTIONS": [],
        "HEAD": [],
        "POST": [],
        "PUT": ["%(app_label)s.change_%(model_name)s"],
        "PATCH": ["%(app_label)s.change_%(model_name)s"],
        "DELETE": ["%(app_label)s.delete_%(model_name)s"],
    }

class DjangoModelViewPermissionsAllowAllCreateAndUpdate(permissions.DjangoModelPermissions):
    """Allow all the permissions for create and delete"""

    perms_map = {
        "GET": ["%(app_label)s.view_%(model_name)s"],
        "OPTIONS": [],
        "HEAD": [],
        "POST": ["%(app_label)s.add_%(model_name)s"],
        "PUT": ["%(app_label)s.change_%(model_name)s"],
        "PATCH": [],
        "DELETE": ["%(app_label)s.delete_%(model_name)s"],
    }
