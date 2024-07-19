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

from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError as ValidationErrorDRF


# NOTE: Importamos este decorador para poder customizar los 
# parámetros y responses en Swagger, para aquellas
# vistas de API basadas en funciones y basadas en Clases 
# que no tengan definido por defecto los métodos HTTP.

#from drf_yasg.utils import swagger_auto_schema
#from drf_yasg import openapi

from base.api.serializers import *
from base.models import *
from django.http import JsonResponse
from django.shortcuts import render, redirect, HttpResponse
from django.core.mail import EmailMessage
from django.conf import settings
from ..forms import ContactForm
from .permissions import IsOwnerOrReadOnly
from ..mixins import AnonUserInteractionMixin, ReactionCountMixin, PreventDuplicateReactionMixin

class UserListView(ListAPIView):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [AllowAny] 

class UserCreateView(CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]    
    
    def post(self, request, *args, **kwargs):
        print("UserCreateView post method called") 
        return super().post(request, *args, **kwargs)
    

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
        user, anon_user = self.handle_anon_user(self.request)
        post_id = self.kwargs['post_id']
        post = Post.objects.get(id=post_id)
        serializer.save(user=user, anon_user=anon_user, post=post)

class CommentRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsOwnerOrReadOnly]
    lookup_field = 'id'

    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj


class PostLikeListCreateAPIView(ReactionCountMixin, PreventDuplicateReactionMixin, ListCreateAPIView):
    serializer_class = PostLikeSerializer
    permission_classes = [AllowAny]
    reaction_model = PostLike
    
    def get_queryset(self):
        return PostLike.objects.filter(post_id=self.kwargs['post_id'])

    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        post = Post.objects.get(id=post_id)
        user, anon_user = self.check_duplicate_reaction(self.request, post_id=post)

        serializer.save(user=user, anon_user=anon_user, post=post)
        
        
class PostLikeDestroyAPIView(DestroyAPIView):
    queryset = PostLike.objects.all()
    serializer_class = PostLikeSerializer
    permission_classes = [IsOwnerOrReadOnly]  
    lookup_field = 'id'



class PostHeartListCreateAPIView(ReactionCountMixin, PreventDuplicateReactionMixin, ListCreateAPIView):
    serializer_class = PostHeartSerializer
    permission_classes = [AllowAny]
    reaction_model = PostHeart
    
    def get_queryset(self):
        return PostHeart.objects.filter(post_id=self.kwargs['post_id'])

    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        post = Post.objects.get(id=post_id)
        user, anon_user = self.check_duplicate_reaction(self.request, post_id=post)

        serializer.save(user=user, anon_user=anon_user, post=post)
        
        
class PostHeartDestroyAPIView(DestroyAPIView):
    queryset = PostHeart.objects.all()
    serializer_class = PostHeartSerializer
    permission_classes = [IsOwnerOrReadOnly]  
    lookup_field = 'id'

        
        
class CommentLikeListCreateAPIView(ReactionCountMixin, PreventDuplicateReactionMixin,  ListCreateAPIView):
    serializer_class = CommentLikeSerializer
    permission_classes = [AllowAny]
    reaction_model = CommentLike

    def get_queryset(self):
        return CommentLike.objects.filter(comment_id=self.kwargs['comment_id'])

    def perform_create(self, serializer):
        comment_id = self.kwargs['comment_id']
        comment = Comment.objects.get(id=comment_id)
        user, anon_user = self.check_duplicate_reaction(self.request, comment_id=comment)
        serializer.save(user=user, anon_user=anon_user, comment=comment)
        
        
class CommentLikeDestroyAPIView(DestroyAPIView):
    queryset = CommentLike.objects.all()
    serializer_class = CommentLikeSerializer
    permission_classes = [IsOwnerOrReadOnly]  
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
        user, anon_user = self.check_duplicate_reaction(self.request, comment_id=comment)
        serializer.save(user=user, anon_user=anon_user, comment=comment)
        
        
class CommentDislikeDestroyAPIView(DestroyAPIView):
    queryset = CommentDislike.objects.all()
    serializer_class = CommentDislikeSerializer
    permission_classes = [IsOwnerOrReadOnly]  
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
        user, anon_user = self.check_duplicate_reaction(self.request, comment_id=comment)
        serializer.save(user=user, anon_user=anon_user, comment=comment)
        
class CommentHeartDestroyAPIView(DestroyAPIView):
    queryset = CommentHeart.objects.all()
    serializer_class = CommentHeartSerializer
    permission_classes = [IsOwnerOrReadOnly]  
    lookup_field = 'id'


def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            subject = form.cleaned_data['subject']
            message = form.cleaned_data['message']
            email_message = EmailMessage(
                subject,
                f'Name: {name}\nEmail: {email}\n Message:\n{message}',
                from_email = [email],
                to = [settings.EMAIL_HOST_USER],
                reply_to=[email]
            )
            email_message.send()
            return redirect('success')
                
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    else:
        form = ContactForm()
    return render (request, 'index.html', {'form': form})

        
def success(request):
    return HttpResponse('Thanks for your message. I will contact you as soon as possible.')

