from django_filters import rest_framework as filters

from apps.orders.models import OrderModel


class OrderFilter(filters.FilterSet):
    class Meta:
        model = OrderModel
        fields = (
            'age',
            'course',
            'course_format',
            'course_type',
            'status',
            'group',
        )

    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    surname = filters.CharFilter(field_name='surname', lookup_expr='icontains')
    email = filters.CharFilter(field_name='email', lookup_expr='icontains')
    phone = filters.CharFilter(field_name='phone', lookup_expr='icontains')
    start_date = filters.DateFilter(field_name='created_at', lookup_expr='date__gte')
    end_date = filters.DateFilter(field_name='created_at', lookup_expr='date__lte')
    my = filters.BooleanFilter(method='filter_my')
    order = filters.OrderingFilter(
        fields=(
            'id',
            'age',
            'course',
            'course_format',
            'course_type',
            'status',
            'group',
            'name',
            'surname',
            'email',
            'phone',
            'start_date',
            'end_date',
        )
    )

    def filter_my(self, queryset, _, value):
        if value:
            return queryset.filter(manager=self.request.user)
        return value
