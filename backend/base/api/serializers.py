from django.contrib.auth.models import User

from django.contrib.auth import password_validation
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError as DjangoValidationError

from rest_framework import serializers
from rest_framework.authtoken.models import Token

from base.models import Anon_User, Post, PostLike, Comment, CommentLike, CommentDislike, CommentHeart

class UserSerializer(serializers.ModelSerializer):
    name=serializers.SerializerMethodField(read_only=True)
    _id=serializers.SerializerMethodField(read_only=True)
    isAdmin=serializers.SerializerMethodField(read_only=True)


    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin']
        
    def get__id(self, obj):
        _id=obj.id
        
        return _id
        
    def get_isAdmin(self, obj):
        isAdmin=obj.is_staff
        
        return isAdmin
        
    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email
            
        return name

class Anon_UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Anon_User
        fields = '__all__'
        
class PostSerializer(serializers.ModelSerializer):
    comments = 'CommentSerializer'(many=True, read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'image', 'likes', 'github_link', 'website_link']
        

class PostLikeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PostLike
        fields = ['id', 'user', 'anon_user', 'post']
        

class CommentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Comment
        fields = '__all__'
        
class CommentLikeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CommentLike
        fields = ['id', 'user', 'anon_user', 'comment']

class CommentDislikeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CommentDislike
        fields = ['id', 'user', 'anon_user', 'comment']
        
class CommentHeartSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CommentHeart
        fields = ['id', 'user', 'anon_user', 'comment']
        