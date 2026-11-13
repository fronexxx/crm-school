from django.contrib.auth.base_user import BaseUserManager
from django.db.models import Count

from core.constants.choices import RoleChoices


class UserManager(BaseUserManager):
    def create_user(self, email=None, password=None, **extra_fields):
        if not email:
            raise ValueError('User must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields['role'] = RoleChoices.ADMIN
        extra_fields.setdefault('is_active', True)

        if extra_fields['is_active'] is not True:
            raise ValueError('Superuser must be is_active')


        user = self.create_user(email=email, password=password, **extra_fields)
        return user

    def with_total(self):
        return self.annotate(total=Count('orders'))
