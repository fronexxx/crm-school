from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
from core.constants.choices import CourseChoices, CourseFormatChoices, CourseTypeChoices, StatusChoices

UserModel = get_user_model()


class GroupModel(models.Model):
    name = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class OrderModel(models.Model):
    class Meta:
        db_table = 'orders'
        ordering = ('-id', )

    name = models.CharField(max_length=25, null=True, blank=True)
    surname = models.CharField(max_length=25, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    age = models.PositiveSmallIntegerField(null=True, blank=True)
    course = models.CharField(max_length=10, choices=CourseChoices, null=True, blank=True)
    course_format = models.CharField(max_length=15, choices=CourseFormatChoices, null=True, blank=True)
    course_type = models.CharField(max_length=15, choices=CourseTypeChoices, null=True, blank=True)
    status = models.CharField(max_length=15, choices=StatusChoices, default=StatusChoices.NEW)
    sum = models.PositiveIntegerField(null=True, blank=True)
    already_paid = models.PositiveIntegerField(null=True, blank=True)
    utm = models.CharField(max_length=100, null=True, blank=True)
    msg = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    manager = models.ForeignKey(UserModel, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    group = models.ForeignKey(GroupModel, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')

    def __str__(self) -> str:
        return self.name

class CommentModel(models.Model):
    class Meta:
        db_table = 'comments'
        ordering = ('-created_at', '-id')

    order = models.ForeignKey(OrderModel, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(UserModel, on_delete=models.SET_NULL, null=True, related_name='comments')

    text = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

