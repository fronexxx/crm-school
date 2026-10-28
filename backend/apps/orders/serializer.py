from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.orders.models import CommentModel, GroupModel, OrderModel

UserModel = get_user_model()


class ShortManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('id', 'first_name', 'last_name')


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = CommentModel
        fields = ('id', 'author', 'text', 'created_at')
        read_only_fields = ('id', 'author', 'created_at',)

    def get_author(self, obj):
        if not obj.author:
            return None
        return f'{obj.author.first_name} {obj.author.last_name}'


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupModel
        fields = ('id', 'name')


class OrderSerializer(serializers.ModelSerializer):
    manager = ShortManagerSerializer(read_only=True)

    class Meta:
        model = OrderModel
        fields = ('id', 'name', 'surname', 'email', 'phone', 'age', 'course', 'course_format', 'course_type', 'status', 'manager', 'sum', 'already_paid', 'group',
                  'created_at', 'utm', 'msg')
        read_only_fields = ('id', 'created_at', 'utm', 'msg')

    @staticmethod
    def validate_phone(value: str):
        if value.startswith('0'):
            value = '+38' + value
        return value


