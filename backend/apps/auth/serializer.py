from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

UserModel = get_user_model()


class LoginSerializer(TokenObtainPairSerializer):
    default_error_messages = {
        'no_active_account': 'Невірний email або пароль',
    }

    def validate(self, attrs):
        email = attrs.get(self.username_field)
        password = attrs.get('password', '')
        user = UserModel.objects.filter(email=email).first()

        if user:
           if user.is_banned and user.check_password(password):
               raise AuthenticationFailed('Ваш акаунт заблоковано. Зверніться до адміністратора.')

           if not user.is_active and not user.is_banned and not user.has_usable_password:
               raise AuthenticationFailed('Акаунт ще не активовано.')

        return super().validate(attrs)




