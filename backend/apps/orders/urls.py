from django.urls import path

from apps.orders.views import CommentCreateView, ListCreateGroupView

urlpatterns = [
    path('/<int:pk>/comment', CommentCreateView.as_view(), name='orders_create_comment'),
    path('/groups', ListCreateGroupView.as_view(), name='orders_get_groups'),
    path('/groups/create', ListCreateGroupView.as_view(), name='orders_create_group'),
]