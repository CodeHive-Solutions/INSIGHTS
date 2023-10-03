from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user has the "admin" role
        return request.user and request.user.role == 'admin'
