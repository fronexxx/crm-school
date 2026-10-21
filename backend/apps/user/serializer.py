from rest_framework import serializers

from apps.user.models import UserModel


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('id','email', 'first_name', 'last_name', 'role', 'created_at', 'updated_at')
        read_only_fields = ('role', 'created_at', 'updated_at')

    def create(self, validated_data):
        return UserModel.objects.create_user(**validated_data)
