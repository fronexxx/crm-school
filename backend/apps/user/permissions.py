from rest_framework.permissions import BasePermission
from rest_framework.request import Request


class IsAdmin(BasePermission):
    def has_permission(self, request: Request, view):
        user = request.user
        return bool(
            user and
            user.is_authenticated and
            user.is_admin
        )


