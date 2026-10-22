from django.urls import path

from apps.user.views import ManagerCreateView, ListManagersView, BanManagerView, UnbanManagerView, ActivationTokenView, ManagerActivateView

urlpatterns = [
    path('', ListManagersView.as_view(), name='user_manager_list'),
    path('/create', ManagerCreateView.as_view(), name='user_manager_create'),
    path('/<int:pk>/ban', BanManagerView.as_view(), name='user_manager_ban'),
    path('/<int:pk>/unban', UnbanManagerView.as_view(), name='user_manager_unban'),
    path('/<int:pk>/activation-token', ActivationTokenView.as_view(), name='user_manager_activation_token'),
    path('/activate/<str:token>', ManagerActivateView.as_view(), name='user_manager_activate'),
]