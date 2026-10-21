from django.contrib.auth.base_user import BaseUserManager

from core.constants.choices import RoleChoices


class UserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        if not password:
            raise ValueError('Users must have a password')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', RoleChoices.ADMIN)

        if extra_fields['is_active'] is not True:
            raise ValueError('Superuser must be is_active')
        if extra_fields['is_superuser'] is not True:
            raise ValueError('Superuser must be is_superuser')
        if extra_fields['is_staff'] is not True:
            raise ValueError('Superuser must be is_staff')

        user = self.create_user(email=email, password=password, **extra_fields)
        return user
