from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from apps.user.managers import UserManager
from core.constants.choices import RoleChoices
from core.models import BaseModel


class UserModel(AbstractBaseUser, PermissionsMixin, BaseModel):
    class Meta:
        db_table = 'auth_user'

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_banned = models.BooleanField(default=False)
    role = models.CharField(max_length=7, choices=RoleChoices, default=RoleChoices.MANAGER)

    USERNAME_FIELD = 'email'
    objects = UserManager()

