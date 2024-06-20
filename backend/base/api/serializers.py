from django.contrib.auth.models import User

from django.contrib.auth import password_validation
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError as DjangoValidationError

from rest_framework import serializers
from rest_framework.authtoken.models import Token

from base.models import Anon_User, Post, PostLike, Comment, CommentLike, CommentDislike, CommentHeart

class Anon_UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Anon_User
        fields = '__all__'
        
class PostSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Post
        fields = '__all__'
        

class LikeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PostLike
        fields = '__all__'
        

class CommentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Comment
        fields = '__all__'
        
class CommentLikeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CommentLike
        fields = '__all__'

class CommentDislikeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CommentDislike
        fields = '__all__'
        
class CommentHeartSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CommentHeart
        fields = '__all__'
        