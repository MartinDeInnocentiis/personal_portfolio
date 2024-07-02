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

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all(), required=False)
    
    class Meta:
        model = Comment
        fields = ['id', 'user', 'anon_user', 'post', 'content', 'created_at']
        read_only_fields = ['id', 'user', 'anon_user', 'created_at']
        
        
class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True, source='postComments')
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'image', 'likes', 'comments', 'github_link', 'website_link']
        

class PostLikeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PostLike
        fields = ['id', 'user', 'anon_user', 'post']
        
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
        