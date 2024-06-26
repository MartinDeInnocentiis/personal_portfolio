from django.urls import path
from .views import *

urlpatterns = [
    path('contact/', contact, name='contact'),
    
    path('projects/', PostListAPIView.as_view(), name='project-list'),
    path('projects/<int:id>/', PostDetailAPIView.as_view(), name='project-detail'),

    path('projects/create/', PostCreateAPIView.as_view(), name='project-create'),
    path('projects/<int:id>/update/', PostUpdateAPIView.as_view(), name='project-update'),
    path('projects/<int:id>/delete/', PostDestroyAPIView.as_view(), name='project-delete'),


    path('projects/<int:post_id>/comments/', CommentListCreateAPIView.as_view(), name='comment-list-create'),
    path('comments/<int:id>/', CommentRetrieveUpdateDestroyAPIView.as_view(), name='comment-detail-update-delete'),

]