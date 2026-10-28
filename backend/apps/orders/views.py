from django.db.models import Count, Q
from django.db.transaction import atomic
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import GenericAPIView, ListAPIView, CreateAPIView, RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.filter import OrderFilter
from apps.orders.models import OrderModel, GroupModel
from apps.orders.serializer import CommentSerializer, GroupSerializer, OrderSerializer
from apps.user.permissions import IsAdmin, IsManager
from core.constants.choices import StatusChoices


class CommentCreateView(GenericAPIView):
    queryset = OrderModel.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (IsAdmin | IsManager,)

    @atomic
    def post(self, request, *args, **kwargs):
        order = self.get_object()
        user = self.request.user

        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if order.manager_id is None:
            taken = OrderModel.objects.filter(pk=order.id, manager__isnull=True).update(
                manager=user, status=StatusChoices.IN_WORK
            )

            if not taken:
                raise PermissionDenied('Заявку вже взяв інший менеджер')
        elif order.manager_id != user.id:
            raise PermissionDenied('Це не ваша заявка')

        serializer.save(order=order, author=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ListGroupView(ListAPIView):
    queryset = GroupModel.objects.all()
    serializer_class = GroupSerializer
    permission_classes = (IsAdmin | IsManager,)
    pagination_class = None


class CreateGroupView(CreateAPIView):
    queryset = GroupModel.objects.all()
    serializer_class = GroupSerializer
    permission_classes = (IsAdmin | IsManager,)


class ListOrdersView(ListAPIView):
    queryset = OrderModel.objects.all()
    serializer_class = OrderSerializer
    permission_classes = (IsAdmin | IsManager,)
    filterset_class = OrderFilter


class OrderUpdateView(RetrieveUpdateAPIView):
    queryset = OrderModel.objects.all()
    serializer_class = OrderSerializer
    http_method_names = ['patch']
    permission_classes = (IsAdmin | IsManager,)


class OrderStatisticView(APIView):
    permission_classes = (IsAdmin,)

    def get(self, request):
        stats = OrderModel.objects.aggregate(
            total=Count('id'),
            **{s: Count('id', filter=Q(status=s)) for s in StatusChoices.values},
        )
        return Response(stats)
