from django.contrib.auth import authenticate
from django.forms.models import model_to_dict
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.decorators import api_view
# (GET - ListAPIView) Listar todos los elementos en la entidad:
# (POST - CreateAPIView) Inserta elementos en la DB
# (GET - RetrieveAPIView) Devuelve un solo elemento de la entidad.
# (GET-POST - ListCreateAPIView) Para listar o insertar elementos en la DB
# (GET-PUT - RetrieveUpdateAPIView) Devuelve o actualiza un elemento en particular.
# (DELETE - DestroyAPIView) Permite eliminar un elemento.
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
from rest_framework.validators import ValidationError
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter
from django.db.models import Q

# NOTE: Importamos este decorador para poder customizar los 
# parámetros y responses en Swagger, para aquellas
# vistas de API basadas en funciones y basadas en Clases 
# que no tengan definido por defecto los métodos HTTP.

#from drf_yasg.utils import swagger_auto_schema
#from drf_yasg import openapi

from base.api.serializers import *
from base.models import *
from rest_framework.pagination import PageNumberPagination
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.conf import settings
from ..forms import ContactForm
from .permissions import IsOwnerOrReadOnly
from ..mixins import AnonUserInteractionMixin

from ..functions import send_mail_google
from django.views.generic import FormView
from django import forms
from django.urls import reverse_lazy

class EmailForm(forms.Form):
    email = forms.EmailField(label='Email Address...')

class SendEmail (FormView):
    template_name ='index.html'
    form_class = EmailForm
    success_url = reverse_lazy ('send-mail')
    
    def form_valid (self, form):
        send_mail_google()
        print (form.cleaned_data['email'])
        
        return super().form_valid(form)
    
    

class PostListAPIView(ListAPIView):
    queryset = Post.objects.all().order_by('id')
    serializer_class = PostSerializer
    permission_classes = [AllowAny] 
    
class PostDetailAPIView(ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'id'
    permission_classes = [AllowAny] 
    
class PostCreateAPIView(CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAdminUser]  

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

    
        
class CommentListCreateAPIView(ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs['post_id'])

    def perform_create(self, serializer): #se llama cuando se crea (post) un nuevo comment, asegurando que se asocie con el post correcto
        user, anon_user = self.handle_anon_user(self.request)
        # asumiendo que post_id es pasado en la URL
        serializer.save(user=user, anon_user=anon_user, post_id=self.kwargs['post_id'])

class CommentRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsOwnerOrReadOnly]  # APPLIES CUSTOM PERMISSION.
    lookup_field = 'id'


class PostLikeListCreateAPIView(ListCreateAPIView):
    serializer_class = PostLikeSerializer

    def get_queryset(self):
        return PostLike.objects.filter(post_id=self.kwargs['post_id'])

    def perform_create(self, serializer):
        user, anon_user = self.handle_anon_user(self.request)
        serializer.save(user=user, anon_user=anon_user, post_id=self.kwargs['post_id'])
        
        
class PostLikeDestroyAPIView(DestroyAPIView):
    queryset = PostLike.objects.all()
    serializer_class = PostLikeSerializer
    permission_classes = [IsOwnerOrReadOnly]  
    lookup_field = 'id'

        
        
class CommentLikeListCreateAPIView(ListCreateAPIView):
    serializer_class = CommentLikeSerializer

    def get_queryset(self):
        return CommentLike.objects.filter(comment_id=self.kwargs['comment_id'])

    def perform_create(self, serializer):
        user, anon_user = self.handle_anon_user(self.request)
        serializer.save(user=user, anon_user=anon_user, comment_id=self.kwargs['comment_id'])
        
        
class CommentLikeDestroyAPIView(DestroyAPIView):
    queryset = CommentLike.objects.all()
    serializer_class = CommentLikeSerializer
    permission_classes = [IsOwnerOrReadOnly]  
    lookup_field = 'id'

        
class CommentDislikeListCreateAPIView(ListCreateAPIView):
    serializer_class = CommentDislikeSerializer

    def get_queryset(self):
        return CommentDislike.objects.filter(comment_id=self.kwargs['comment_id'])

    def perform_create(self, serializer):
        user, anon_user = self.handle_anon_user(self.request)
        serializer.save(user=user, anon_user=anon_user, comment_id=self.kwargs['comment_id'])
        
        
class CommentDislikeDestroyAPIView(DestroyAPIView):
    queryset = CommentDislike.objects.all()
    serializer_class = CommentDislikeSerializer
    permission_classes = [IsOwnerOrReadOnly]  
    lookup_field = 'id'
        
        
class CommentHeartListCreateAPIView(ListCreateAPIView):
    serializer_class = CommentHeartSerializer

    def get_queryset(self):
        return CommentHeart.objects.filter(comment_id=self.kwargs['comment_id'])

    def perform_create(self, serializer):
        user, anon_user = self.handle_anon_user(self.request)
        serializer.save(user=user, anon_user=anon_user, comment_id=self.kwargs['comment_id'])
        
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

            send_mail(
                subject,
                f'Name: {name}\nEmail: {email}\n\Message:\n{message}',
                email,
                [settings.CONTACT_EMAIL],  # CONFIGURAR EN SETTINGS.PY!!!!!!!!!!!!
                fail_silently=False,
            )
            return JsonResponse({'success': 'Thanks for your message. I will contact you as soon as possible.'}, status=200)
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)