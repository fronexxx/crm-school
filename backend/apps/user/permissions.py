from rest_framework.permissions import BasePermission
from rest_framework.request import Request

from core.constants.choices import RoleChoices


class IsAdmin(BasePermission):
    def has_permission(self, request: Request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == RoleChoices.ADMIN
        )

class IsManager(BasePermission):
    def has_permission(self, request: Request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == RoleChoices.MANAGER
        )

