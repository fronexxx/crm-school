from django.db.models import Count, Q
from django.db.transaction import atomic
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import GenericAPIView, ListAPIView, UpdateAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from django.utils import timezone
from io import BytesIO
from openpyxl import Workbook
from openpyxl.styles import Font
from openpyxl.utils import get_column_letter

from apps.orders.filter import OrderFilter
from apps.orders.models import OrderModel, GroupModel
from apps.orders.serializer import CommentSerializer, GroupSerializer, OrderSerializer
from apps.user.permissions import IsAdmin
from core.constants.choices import StatusChoices, CourseChoices, CourseFormatChoices, CourseTypeChoices

HEADERS = ['id', 'name', 'surname', 'email', 'phone', 'age', 'course', 'course_format',
           'course_type', 'status', 'sum', 'alreadyPaid', 'group', 'created_at', 'manager']


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

class OrderExcelView(ListOrdersView):
    pagination_class = None

    def list(self, request, *args, **kwargs):
        orders = self.filter_queryset(self.get_queryset())

        wb = Workbook()
        ws = wb.active
        ws.title = 'Orders'
        ws.append(HEADERS)

        for cell in ws[1]:
            cell.font = Font(bold=True)

        for order in orders:
            ws.append([
                order.id,
                order.name,
                order.surname,
                order.email,
                order.phone,
                order.age,
                order.course,
                order.course_format,
                order.course_type,
                order.status,
                order.sum,
                order.already_paid,
                order.group.name if order.group else None,
                timezone.localtime(order.created_at).replace(tzinfo=None),
                f'{order.manager.first_name}' if order.manager else None,
            ])

        for index in range(1, len(HEADERS) + 1):
            ws.column_dimensions[get_column_letter(index)].width = 18

        buffer = BytesIO()
        wb.save(buffer)

        response = HttpResponse(
            buffer.getvalue(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        )
        response['Content-Disposition'] = 'attachment; filename="orders.xlsx"'
        return response


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
