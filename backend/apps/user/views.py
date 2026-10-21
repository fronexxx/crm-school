from rest_framework.generics import CreateAPIView

from apps.user.models import UserModel
from apps.user.permissions import IsAdmin
from apps.user.serializer import UserSerializer


class ManagerCreateView(CreateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]


