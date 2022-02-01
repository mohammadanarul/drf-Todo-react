from django.urls import path
from .views import *

urlpatterns = [
    path("", api_overview),
    path('list-api/', task_list_api),
    path('create-task/', create_task_api),
    path('update-task/<int:pk>/', update_task_api),
    path('partially-task/<int:pk>/', partially_task_api),
    path('delete-task/<int:pk>/', delete_task_api),
]
