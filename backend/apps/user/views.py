from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView, ListAPIView, GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.user.pagination import ManagersPagePagination
from apps.user.permissions import IsAdmin, IsManager
from apps.user.serializer import UserSerializer, SetPasswordSerializer
from core.constants.choices import RoleChoices
from core.services.jwt_service import JWTService, ActivateToken, RecoveryToken

UserModel = get_user_model()


class ManagerCreateView(CreateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAdmin, )

class ListManagersView(ListAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAdmin, )
    pagination_class = ManagersPagePagination

    def get_queryset(self):
        return UserModel.objects.exclude(pk=self.request.user.id)

class BanManagerView(GenericAPIView):
    permission_classes = (IsAdmin, )
    def get_queryset(self):
        return UserModel.objects.exclude(pk=self.request.user.id)

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        if not user.is_banned and user.is_active:
            user.is_banned = True
            user.is_active = False
            user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UnbanManagerView(GenericAPIView):
    permission_classes = (IsAdmin, )
    def get_queryset(self):
        return UserModel.objects.exclude(pk=self.request.user.id)

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        if not user.is_active and user.is_banned:
            user.is_active = True
            user.is_banned = False
            user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ActivationTokenView(GenericAPIView):
    permission_classes = (IsAdmin, )
    queryset = UserModel.objects.filter(role=RoleChoices.MANAGER)

    def post(self, request, *args, **kwargs):
        user = self.get_object()

        if user.is_active:
            raise ValidationError('The manager has already been activated')
        if user.is_banned:
            raise ValidationError('The manager is banned!!!')

        token = JWTService.create_token(user, ActivateToken)
        return Response({'token': str(token)}, status=status.HTTP_200_OK)

class ManagerActivateView(GenericAPIView):
    permission_classes = (AllowAny, )
    authentication_classes = []

    def post(self, request, token):
        serializer = SetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = JWTService.verify_token(token, ActivateToken)

        if user.has_usable_password():
            raise ValidationError('The manager is already activated!!!')
        if user.is_banned:
            raise ValidationError('The manager is banned!!!')

        password = serializer.validated_data['password']
        user.set_password(password)
        user.is_active = True
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ManagerRecoveryTokenView(GenericAPIView):
    permission_classes = (IsAdmin, )
    queryset = UserModel.objects.filter(role=RoleChoices.MANAGER)

    def post(self, request, *args, **kwargs):
        user = self.get_object()

        if user.is_banned:
            raise ValidationError('The manager is banned!!!')
        if not user.is_active:
            raise ValidationError('The manager is not activated!!!')

        recovery_token = JWTService.create_token(user, RecoveryToken)
        return Response({'recovery_token': str(recovery_token)}, status=status.HTTP_200_OK)

class ManagerRecoveryPasswordView(GenericAPIView):
    permission_classes = (AllowAny, )
    serializer_class = SetPasswordSerializer
    authentication_classes = []

    def post(self, request, recovery_token):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = JWTService.verify_token(recovery_token, RecoveryToken)

        if user.is_banned:
            raise ValidationError('The manager is banned!!!')

        password = serializer.validated_data['password']
        user.set_password(password)
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)




