from django.urls import path

from apps.user.views import ManagerCreateView

urlpatterns = [
    path('/create', ManagerCreateView.as_view(), name='user_manager_create'),
]