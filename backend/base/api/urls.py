from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('contact/', contact, name='contact'),
    
    # URLs for Users
    path('list-user/', UserListView.as_view(), name='list-user'),
    path('list-anonuser/', AnonUserListView.as_view(), name='list-anonuser'),
    path('create-user/', UserCreateView.as_view(), name='create-user'),
    path('user/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    
    # URLs for Posts
    path('posts/', PostListAPIView.as_view(), name='post-list'),
    path('posts/<int:id>/', PostDetailAPIView.as_view(), name='post-detail'),

    path('posts/create/', PostCreateAPIView.as_view(), name='post-create'),
    path('posts/<int:id>/update/', PostUpdateAPIView.as_view(), name='post-update'),
    path('posts/<int:id>/delete/', PostDestroyAPIView.as_view(), name='post-delete'),

    # URLs for Comments
    path('posts/<int:post_id>/comments/', CommentListCreateAPIView.as_view(), name='comment-list-create'),
    path('comments/<int:id>/', CommentRetrieveUpdateDestroyAPIView.as_view(), name='comment-detail-update-delete'),

    # URLs for PostLikes
    path('posts/<int:post_id>/likes/', PostLikeListCreateAPIView.as_view(), name='post-like-list-create'),
    path('posts/likes/<int:id>/', PostLikeDestroyAPIView.as_view(), name='post-like-destroy'),

    # URLs for PostHearts
    path('posts/<int:post_id>/hearts/', PostHeartListCreateAPIView.as_view(), name='post-heart-list-create'),
    path('posts/hearts/<int:id>/', PostHeartDestroyAPIView.as_view(), name='post-heart-destroy'),

    # URLs for CommentLikes
    path('comments/<int:comment_id>/likes/', CommentLikeListCreateAPIView.as_view(), name='comment-like-list-create'),
    path('comments/likes/<int:id>/', CommentLikeDestroyAPIView.as_view(), name='comment-like-destroy'),

    # URLs for CommentDislikes
    path('comments/<int:comment_id>/dislikes/', CommentDislikeListCreateAPIView.as_view(), name='comment-dislike-list-create'),
    path('comments/dislikes/<int:id>/', CommentDislikeDestroyAPIView.as_view(), name='comment-dislike-destroy'),

    # URLs for CommentHearts
    path('comments/<int:comment_id>/hearts/', CommentHeartListCreateAPIView.as_view(), name='comment-heart-list-create'),
    path('comments/hearts/<int:id>/', CommentHeartDestroyAPIView.as_view(), name='comment-heart-destroy'),

    # URLs for Emails
    path("contact/", contact, name='contact'),
    path("success/", success, name='success'),
    
    
    # URLs FOR ACCESS & REFRESH TOKENS 
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('custom-token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),

    path('update-anon-username/', UpdateAnonUserNameView.as_view(), name='update-anon-username'),


]