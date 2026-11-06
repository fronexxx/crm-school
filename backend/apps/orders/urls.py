from django.urls import path

from apps.orders.views import CommentRetrieveCreateView, ListGroupView, ListOrdersView, CreateGroupView, OrderUpdateView, OrderStatisticView, OrderChoicesView

urlpatterns = [
    path('', ListOrdersView.as_view(), name='orders_list'),
    path('/<int:pk>/update', OrderUpdateView.as_view(), name='orders_update'),
    path('/<int:pk>/comment', CommentRetrieveCreateView.as_view(), name='orders_create_comment'),
    path('/groups', ListGroupView.as_view(), name='orders_get_groups'),
    path('/groups/create', CreateGroupView.as_view(), name='orders_create_group'),
    path('/statistic', OrderStatisticView.as_view(), name='orders_statistic'),
    path('/choices', OrderChoicesView.as_view(), name='orders_get_choices'),
]