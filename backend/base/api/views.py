from rest_framework import status
from rest_framework.authentication import TokenAuthentication, BasicAuthentication

from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    ListCreateAPIView,
    DestroyAPIView,
    UpdateAPIView,
    RetrieveUpdateDestroyAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView,
    GenericAPIView,
)

from rest_framework.permissions import IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError as ValidationErrorDRF
from rest_framework.exceptions import NotFound
from uuid import uuid4

# NOTE: Importamos este decorador para poder customizar los 
# parámetros y responses en Swagger, para aquellas
# vistas de API basadas en funciones y basadas en Clases 
# que no tengan definido por defecto los métodos HTTP.

#from drf_yasg.utils import swagger_auto_schema
#from drf_yasg import openapi

from .serializers import *
from base.models import *
from django.http import JsonResponse
from django.shortcuts import render, redirect, HttpResponse, get_object_or_404
from django.core.mail import EmailMessage
from django.conf import settings
from ..forms import ContactForm
from .permissions import IsOwnerOrReadOnly
from ..mixins import AnonUserInteractionMixin, ReactionCountMixin, PreventDuplicateReactionMixin
from rest_framework_simplejwt.views import TokenObtainPairView
from django.views.decorators.csrf import csrf_exempt
import json

class AnonUserListView(ListAPIView):
    queryset = Anon_User.objects.all().order_by('id')
    serializer_class = Anon_UserSerializer
    permission_classes = [AllowAny] 

class UserListView(ListAPIView):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [AllowAny] 
    
class UserDetailView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserCreateView(CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]    
    
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    

class PostListAPIView(ListAPIView):
    queryset = Post.objects.all().order_by('id')
    serializer_class = PostSerializer
    permission_classes = [AllowAny] 
    
class PostDetailAPIView(RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'id'
    permission_classes = [AllowAny] 
    
class PostCreateAPIView(CreateAPIView):
    permission_classes = [IsAdminUser]  
    
    def post(self, request, *args, **kwargs):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user  
            serializer.save(user=user)  
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostUpdateAPIView(UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAdminUser]  
    lookup_field = 'id'

class PostDestroyAPIView(DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAdminUser]  
    lookup_field = 'id'

    
        
class CommentListCreateAPIView(AnonUserInteractionMixin, ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs['post_id'])

    def perform_create(self, serializer):
        anon_user_data = self.request.data.get('anon_user')
        user, anon_user = self.handle_anon_user(self.request, anon_user_data)
        post_id = self.kwargs['post_id']
        post = Post.objects.get(id=post_id)
        serializer.save(user=user, anon_user=anon_user, post=post)

class CommentRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj

class UpdateAnonUserNameView(UpdateAPIView):
    queryset = Anon_User.objects.all()
    serializer_class = Anon_UserSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        anon_user_id = self.request.headers.get('X-Anon-User-ID') or self.request.session.get('anon_user_id')
        
        if anon_user_id:
            anon_user = Anon_User.objects.get(id=anon_user_id)
        else:
            raise NotFound('Anon user not found in session.')
        # try:
        #     anon_user = Anon_User.objects.get(id=anon_user_id)
        # except Anon_User.DoesNotExist:
        #     raise NotFound('Anon user does not exist.')
        return anon_user

    
class PostLikeListCreateAPIView(ReactionCountMixin, PreventDuplicateReactionMixin, ListCreateAPIView):
    # queryset = PostLike.objects.all()
    # serializer_class = PostLikeSerializer
    # permission_classes = [AllowAny]

    # def perform_create(self, serializer):
    #     if self.request.user.is_authenticated:
    #         serializer.save(user=self.request.user)
    #     else:
    #         anon_user_id = self.request.session.get('anon_user_id')
    #         if not anon_user_id:
    #             anon_user_id = str(uuid4())
    #             self.request.session['anon_user_id'] = anon_user_id

    #         anon_user, created = Anon_User.objects.get_or_create(id=anon_user_id)
    #         serializer.save(anon_user=anon_user)
            
    #***************************************************************

    serializer_class = PostLikeSerializer
    permission_classes = [AllowAny]
    reaction_model = PostLike
    
    def get_queryset(self):
        return PostLike.objects.filter(post_id=self.kwargs['post_id'])

    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        #post = Post.objects.get(id=post_id)
        post = get_object_or_404(Post, id=post_id)
        user, anon_user = self.check_duplicate_reaction(self.request, post_id=post)

        #serializer.save(user=user, anon_user=anon_user, post=post)
        instance = serializer.save(user=user, anon_user=anon_user, post=post)
        return Response(PostLikeSerializer(instance).data)

        
class PostLikeDestroyAPIView(DestroyAPIView):
    queryset = PostLike.objects.all()
    serializer_class = PostLikeSerializer
    permission_classes = [AllowAny]  
    lookup_field = 'id'


# class PostLikeDestroyAPIView(DestroyAPIView):
#     queryset = PostLike.objects.all()
#     serializer_class = PostLikeSerializer
#     permission_classes = [IsOwnerOrReadOnly]
#     lookup_field = 'id'

#     def delete(self, request, *args, **kwargs):
#         self.check_permissions(request)
#         instance = self.get_object()

#         # Comprobar si el usuario anónimo tiene permiso
#         anon_user_id = request.headers.get('anon_user_id')
#         if instance.user != request.user and (anon_user_id is None or instance.anon_user_id != anon_user_id):
#             return Response({'detail': 'No permission to delete this like.'}, status=status.HTTP_403_FORBIDDEN)

#         self.perform_destroy(instance)
#         return Response(status=status.HTTP_204_NO_CONTENT)
 

class PostHeartListCreateAPIView(ReactionCountMixin, PreventDuplicateReactionMixin, ListCreateAPIView):
    serializer_class = PostHeartSerializer
    permission_classes = [AllowAny]
    reaction_model = PostHeart
    
    def get_queryset(self):
        return PostHeart.objects.filter(post_id=self.kwargs['post_id'])

    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        #post = Post.objects.get(id=post_id)
        post = get_object_or_404(Post, id=post_id)
        user, anon_user = self.check_duplicate_reaction(self.request, post_id=post)

        #serializer.save(user=user, anon_user=anon_user, post=post)
        instance = serializer.save(user=user, anon_user=anon_user, post=post)
        return Response(PostHeartSerializer(instance).data)


        
class PostHeartDestroyAPIView(DestroyAPIView):
    queryset = PostHeart.objects.all()
    serializer_class = PostHeartSerializer
    permission_classes = [AllowAny]  
    lookup_field = 'id'


# class PostHeartDestroyAPIView(DestroyAPIView):
#     queryset = PostHeart.objects.all()
#     serializer_class = PostHeartSerializer
#     permission_classes = [IsOwnerOrReadOnly]
#     lookup_field = 'id'

#     def delete(self, request, *args, **kwargs):
#         self.check_permissions(request)
#         instance = self.get_object()

#         # Comprobar si el usuario anónimo tiene permiso
#         anon_user_id = request.headers.get('anon_user_id')
#         if instance.user != request.user and (anon_user_id is None or instance.anon_user_id != anon_user_id):
#             return Response({'detail': 'No permission to delete this like.'}, status=status.HTTP_403_FORBIDDEN)

#         self.perform_destroy(instance)
#         return Response(status=status.HTTP_204_NO_CONTENT)
        
        
class CommentLikeListCreateAPIView(ReactionCountMixin, PreventDuplicateReactionMixin,  ListCreateAPIView):
    # serializer_class = CommentLikeSerializer
    # permission_classes = [AllowAny]
    # reaction_model = CommentLike

    # def get_queryset(self):
    #     return CommentLike.objects.filter(comment_id=self.kwargs['comment_id'])

    # def perform_create(self, serializer):
    #     comment_id = self.kwargs['comment_id']
    #     comment = Comment.objects.get(id=comment_id)
    #     user, anon_user = self.check_duplicate_reaction(self.request, comment_id=comment)
    #     serializer.save(user=user, anon_user=anon_user, comment=comment)
    serializer_class = CommentLikeSerializer
    permission_classes = [AllowAny]
    reaction_model = CommentLike

    def get_queryset(self):
        return CommentLike.objects.filter(comment_id=self.kwargs['comment_id'])

    def perform_create(self, serializer):
        comment_id = self.kwargs['comment_id']
        comment = Comment.objects.get(id=comment_id)
        
        
        user, anon_user = self.handle_anon_user(self.request)
        serializer.save(user=user, anon_user=anon_user, comment=comment)       
        
        
class CommentLikeDestroyAPIView(DestroyAPIView):
    queryset = CommentLike.objects.all()
    serializer_class = CommentLikeSerializer
    permission_classes = [AllowAny]  
    lookup_field = 'id'

        
class CommentDislikeListCreateAPIView(ReactionCountMixin, PreventDuplicateReactionMixin, ListCreateAPIView):
    serializer_class = CommentDislikeSerializer
    permission_classes = [AllowAny]
    reaction_model = CommentDislike

    def get_queryset(self):
        return CommentDislike.objects.filter(comment_id=self.kwargs['comment_id'])

    def perform_create(self, serializer):
        comment_id = self.kwargs['comment_id']
        comment = Comment.objects.get(id=comment_id)
        
        
        user, anon_user = self.handle_anon_user(self.request)
        serializer.save(user=user, anon_user=anon_user, comment=comment) 
        
        
class CommentDislikeDestroyAPIView(DestroyAPIView):
    queryset = CommentDislike.objects.all()
    serializer_class = CommentDislikeSerializer
    permission_classes = [AllowAny]  
    lookup_field = 'id'
        
        
class CommentHeartListCreateAPIView(ReactionCountMixin, PreventDuplicateReactionMixin, ListCreateAPIView):
    serializer_class = CommentHeartSerializer
    permission_classes = [AllowAny]
    reaction_model = CommentHeart

    def get_queryset(self):
        return CommentHeart.objects.filter(comment_id=self.kwargs['comment_id'])

    def perform_create(self, serializer):
        comment_id = self.kwargs['comment_id']
        comment = Comment.objects.get(id=comment_id)
        
        
        #24/8 se cambia esto por la linea de abajo     user, anon_user = self.check_duplicate_reaction(self.request, comment_id=comment)
        user, anon_user = self.handle_anon_user(self.request)
        serializer.save(user=user, anon_user=anon_user, comment=comment)
        
class CommentHeartDestroyAPIView(DestroyAPIView):
    queryset = CommentHeart.objects.all()
    serializer_class = CommentHeartSerializer
    permission_classes = [AllowAny]  
    lookup_field = 'id'



@csrf_exempt
def contact(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        name = data['name']
        email = data['email']
        subject = data['subject']
        message = data['message']
        
        email_message = EmailMessage(
            subject,
            f'Name: {name}\nEmail: {email}\n Message:\n{message}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.EMAIL_HOST_USER],
            reply_to=[email]
        )
        email_message.send()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False}, status=400)




        
def success(request):
    return HttpResponse('Thanks for your message. I will contact you as soon as possible.')

