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
    RetrieveAPIView,
    ListCreateAPIView,
    RetrieveUpdateAPIView,
    DestroyAPIView,
    GenericAPIView,
    UpdateAPIView
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


class PostListAPIView(ListAPIView): 
    queryset = Post.objects.all().order_by('id')
    serializer_class = PostSerializer
    pagination_class = None
    
class PostDetailAPIView(RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'id'
    
    
    
class GetCreateCommentAPIView(ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id).order_by('id')

    def post(self, request, *args, **kwargs):
        post_id = self.kwargs.get('post_id')
        data = request.data.copy()
        data['post'] = post_id  

        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    






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