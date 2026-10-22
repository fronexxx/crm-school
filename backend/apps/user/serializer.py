from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from apps.user.models import UserModel


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('id','email', 'first_name', 'last_name', 'is_banned', 'is_active', 'last_login', 'total', 'created_at', 'updated_at')
        read_only_fields = ('total', 'is_active', 'is_banned', 'last_login', 'created_at', 'updated_at')

    def create(self, validated_data):
        return UserModel.objects.create_user(**validated_data)

class SetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=4, max_length=64, write_only=True)
    confirm_password = serializers.CharField(min_length=4, max_length=64, write_only=True)

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError({'password': 'Passwords do not match'})
        validate_password(password)
        return attrs
