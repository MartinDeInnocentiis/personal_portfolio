from django.urls import path
from .views import *

urlpatterns = [
    path('contact/', contact, name='contact'),
    path('projects/', PostListAPIView.as_view(), name='project-list'),
    path('projects/<int:id>/', PostDetailAPIView.as_view(), name='project-detail'),



]