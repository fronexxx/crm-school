from django.core.management import BaseCommand
from faker import Faker
import random
from django.utils import timezone
from apps.orders.models import OrderModel
from core.constants.choices import CourseChoices, CourseFormatChoices, CourseTypeChoices, StatusChoices

fake = Faker('uk_UA')


class Command(BaseCommand):
    help = 'Generate orders'

    def handle(self, *args, **options):
        for i in range(500):
            OrderModel.objects.create(
                name=fake.first_name()[:10],
                surname=fake.last_name()[:10],
                email=fake.unique.email(),
                phone=f'0{random.choice([50, 63, 66, 67, 68, 73, 77, 93, 95, 96, 97, 98])}{random.randint(1000000, 9999999)}',
                age=random.randint(16, 50),
                course=random.choice(CourseChoices.values),
                course_format=random.choice(CourseFormatChoices.values),
                course_type=random.choice(CourseTypeChoices.values),
                status=StatusChoices.NEW,
                sum=random.randint(1000, 20000),
                already_paid=random.randint(0, 1000),
                utm=random.choice([
                    'google',
                    'instagram',
                    'facebook',
                    'telegram',
                    'direct',
                    'site'
                ]),
                msg=fake.sentence()[:20],
                created_at=fake.date_time_between(
                    start_date='-1y',
                    end_date='now',
                    tzinfo=timezone.get_current_timezone(),
                ),
            )
        self.stdout.write(self.style.SUCCESS('Successfully generated orders!'))
