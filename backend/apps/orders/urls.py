from django.urls import path

from apps.orders.views import CommentRetrieveCreateView, ListCreateGroupView, ListOrdersView, OrderUpdateView, OrderStatisticView, OrderChoicesView

urlpatterns = [
    path('', ListOrdersView.as_view(), name='orders_list_'),
    path('/<int:pk>/update', OrderUpdateView.as_view(), name='orders_update'),
    path('/<int:pk>/comment', CommentRetrieveCreateView.as_view(), name='orders_create_comment'),
    path('/groups', ListCreateGroupView.as_view(), name='orders_get_groups'),
    path('/statistic', OrderStatisticView.as_view(), name='orders_statistic'),
    path('/choices', OrderChoicesView.as_view(), name='orders_get_choices'),
]