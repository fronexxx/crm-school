from django.db.models import Count, Q
from django.db.transaction import atomic
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import GenericAPIView, ListAPIView, CreateAPIView, RetrieveUpdateAPIView, UpdateAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.filter import OrderFilter
from apps.orders.models import OrderModel, GroupModel
from apps.orders.serializer import CommentSerializer, GroupSerializer, OrderSerializer
from apps.user.permissions import IsAdmin
from core.constants.choices import StatusChoices, CourseChoices, CourseFormatChoices, CourseTypeChoices


class CommentRetrieveCreateView(GenericAPIView):
    queryset = OrderModel.objects.all()
    serializer_class = CommentSerializer

    def get(self, request, *args, **kwargs):
        order = self.get_object()
        comments = order.comments.select_related('author')
        return Response(CommentSerializer(comments, many=True).data)


    @atomic
    def post(self, request, *args, **kwargs):
        order = self.get_object()
        user = self.request.user

        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if order.manager_id is None:
            taken = OrderModel.objects.filter(pk=order.id, manager__isnull=True).update(manager=user)

            if not taken:
                raise PermissionDenied('Заявку вже взяв інший менеджер')
        elif order.manager_id != user.id:
            raise PermissionDenied('Це не ваша заявка')

        OrderModel.objects.filter(pk=order.id, status=StatusChoices.NEW).update(status=StatusChoices.IN_WORK)

        serializer.save(order=order, author=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



class ListCreateGroupView(ListCreateAPIView):
    queryset = GroupModel.objects.all()
    serializer_class = GroupSerializer
    pagination_class = None


class ListOrdersView(ListAPIView):
    queryset = OrderModel.objects.all()
    serializer_class = OrderSerializer
    filterset_class = OrderFilter


class OrderUpdateView(UpdateAPIView):
    queryset = OrderModel.objects.select_related('manager', 'group')
    serializer_class = OrderSerializer


    @atomic
    def perform_update(self, serializer):
        user = self.request.user
        order = OrderModel.objects.select_for_update().get(pk=serializer.instance.pk)

        if order.manager_id != user.id and not order.manager_id is None:
            raise PermissionDenied('It is not your order')

        serializer.instance = order

        if serializer.validated_data.get('status') == StatusChoices.NEW:
            serializer.save(manager=None)

        else:
            serializer.save()


class OrderStatisticView(APIView):
    permission_classes = (IsAdmin,)

    def get(self, request):
        stats = OrderModel.objects.aggregate(
            total=Count('id'),
            **{s: Count('id', filter=Q(status=s)) for s in StatusChoices.values},
        )
        return Response(stats)

class OrderChoicesView(APIView):

    def get(self, request):
        return Response({
            'courses': [{'value': value, 'label': label} for value, label in CourseChoices.choices],
            'course_formats': [{'value': value, 'label': label} for value, label in CourseFormatChoices.choices],
            'course_types': [{'value': value, 'label': label} for value, label in CourseTypeChoices.choices],
            'statuses': [{'value': value, 'label': label} for value, label in StatusChoices.choices]
        })
