from django.contrib.auth import get_user_model
from django.core.management import BaseCommand

UserModel = get_user_model()


class Command(BaseCommand):
    def handle(self, *args, **options):
        email = 'admin@gmail.com'
        password = 'admin'

        if UserModel.objects.filter(email=email).exists():
             self.stdout.write('Admin already exists')
             return

        UserModel.objects.create_superuser(
            email=email,
            password=password,
            first_name='admin',
            last_name='adminych'
        )

        self.stdout.write(self.style.SUCCESS(f'Admin {email} created'))


