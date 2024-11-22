from django.contrib.auth.models import User

from django.contrib.auth import password_validation
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError as DjangoValidationError

from datetime import datetime
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import re
from base.models import Anon_User, Post, PostLike, PostHeart, Comment, CommentLike, CommentDislike, CommentHeart

class UserSerializer(serializers.ModelSerializer):
    name=serializers.SerializerMethodField(read_only=True)
    _id=serializers.SerializerMethodField(read_only=True)
    isAdmin=serializers.SerializerMethodField(read_only=True)
    password = serializers.CharField(write_only=True)


    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'password']
        extra_kwargs = {
            'username': {'validators': []}  # Disable automatic unique validation
        }
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
    
    def validate(self, data):
        password = data.get('password')
        if not password:
            raise serializers.ValidationError({"password": "This field is required."})
        return data
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
           raise serializers.DjangoValidationError("A user with that username already exists.")
        if not re.match(r'^[\w.@+\- ]+$', value):
           raise serializers.ValidationError("Username may only contain letters, numbers and @/./+/-/_/ /(spaces) as special characters.")
        return value

    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email has already been registered.")
        return value
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        credentials = {
            'username': '',
            'password': attrs.get("password")
        }

        user_obj = User.objects.filter(email=attrs.get("username")).first() or User.objects.filter(username=attrs.get("username")).first()

        if user_obj:
            credentials['username'] = user_obj.username
            user = authenticate(**credentials)
            if user is None:
                raise serializers.ValidationError({"detail": "Incorrect password."})
        else:
            raise serializers.ValidationError({"detail": "User with this username does not exist."})

        data = super().validate(credentials)
        data.update({
            'id': user_obj.id,
            'username': user_obj.username
        })
        return data


class Anon_UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Anon_User
        fields = ['id', 'name']

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    anon_user = Anon_UserSerializer(read_only=True)
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all(), required=False)
    has_like_reacted = serializers.SerializerMethodField()
    like_id = serializers.SerializerMethodField()
    has_dislike_reacted = serializers.SerializerMethodField()
    dislike_id = serializers.SerializerMethodField()
    total_heart_reactions = serializers.SerializerMethodField()
    total_like_reactions = serializers.SerializerMethodField()
    total_dislike_reactions = serializers.SerializerMethodField()
    has_heart_reacted = serializers.SerializerMethodField()
    heart_id = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'anon_user', 'post', 'content', 'created_at', 'total_heart_reactions', 'total_like_reactions', 'total_dislike_reactions','has_like_reacted', 'like_id','has_dislike_reacted', 'dislike_id','has_heart_reacted', 'heart_id']
        read_only_fields = ['id', 'user', 'anon_user', 'created_at']
        
    def get_has_like_reacted(self, obj):
        request = self.context.get('request')
        anon_user_id = request.headers.get('X-Anon-User-ID')
        
        if request.user.is_authenticated:
            return obj.likes_from_comment_likes.filter(user=request.user).exists()
        elif anon_user_id:
            return obj.likes_from_comment_likes.filter(anon_user_id=anon_user_id).exists()
        return False
         
    def get_like_id(self, obj):
        request = self.context.get('request')
        anon_user_id = request.headers.get('X-Anon-User-ID')
        
        if request.user.is_authenticated:
            like = obj.likes_from_comment_likes.filter(user=request.user).first()
        elif anon_user_id:
            like = obj.likes_from_comment_likes.filter(anon_user_id=anon_user_id).first()
        else:
            like = None
    
        return like.id if like else None 
    
        
    def get_has_dislike_reacted(self, obj):
        request = self.context.get('request')
        anon_user_id = request.headers.get('X-Anon-User-ID')
        
        if request.user.is_authenticated:
            return obj.dislikes_from_comment_dislikes.filter(user=request.user).exists()
        elif anon_user_id:
            return obj.dislikes_from_comment_dislikes.filter(anon_user_id=anon_user_id).exists()
        return False
         
    def get_dislike_id(self, obj):
        request = self.context.get('request')
        anon_user_id = request.headers.get('X-Anon-User-ID')
        
        if request.user.is_authenticated:
            dislike = obj.dislikes_from_comment_dislikes.filter(user=request.user).first()
        elif anon_user_id:
            dislike = obj.dislikes_from_comment_dislikes.filter(anon_user_id=anon_user_id).first()
        else:
            dislike = None
    
        return dislike.id if dislike else None 
        
    def get_total_heart_reactions (self, obj):
        return obj.hearts_from_comment_hearts.count()
    
    def get_total_like_reactions (self, obj):
        return obj.likes_from_comment_likes.count()
    
    def get_total_dislike_reactions (self, obj):
        return obj.dislikes_from_comment_dislikes.count()
    
    def get_has_heart_reacted(self, obj):
        request = self.context.get('request')
        anon_user_id = request.headers.get('X-Anon-User-ID')
        
        if request.user.is_authenticated:
            return obj.hearts_from_comment_hearts.filter(user=request.user).exists()
        elif anon_user_id:
            return obj.hearts_from_comment_hearts.filter(anon_user_id=anon_user_id).exists()
        return False
         
    def get_heart_id(self, obj):
        request = self.context.get('request')
        anon_user_id = request.headers.get('X-Anon-User-ID')
        
        if request.user.is_authenticated:
            heart = obj.hearts_from_comment_hearts.filter(user=request.user).first()
        elif anon_user_id:
            heart = obj.hearts_from_comment_hearts.filter(anon_user_id=anon_user_id).first()
        else:
            heart = None
    
        return heart.id if heart else None
        
class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True, source='postComments')
    likes = serializers.SerializerMethodField()
    hearts = serializers.SerializerMethodField()
    total_comments = serializers.SerializerMethodField()
    user_has_liked = serializers.SerializerMethodField()
    user_has_hearted = serializers.SerializerMethodField()
    total_likes = serializers.SerializerMethodField()
    total_hearts = serializers.SerializerMethodField()
    
    like_id = serializers.SerializerMethodField()
    heart_id = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'summary', 'stack', 'image', 'likes', 'hearts', 'comments', 'total_comments', 'total_likes', 'total_hearts', 'github_link', 'website_link', 'status', 'user_has_liked', 'user_has_hearted', 'like_id', 'heart_id']
    
    def get_total_comments(self, obj):
        return obj.postComments.count() 
    
    def get_likes(self, obj):
        from .serializers import PostLikeSerializer  
        return PostLikeSerializer(obj.postLikes.all(), many=True).data
    
    def get_hearts(self, obj):
        from .serializers import PostHeartSerializer  
        return PostHeartSerializer(obj.postHearts.all(), many=True).data
    

    def get_total_likes(self, obj):
        return obj.postLikes.count() 
    
    def get_total_hearts(self, obj):
        return obj.postHearts.count() 



    def get_user_has_liked(self, obj):
        request = self.context.get('request')
        user = request.user if request.user.is_authenticated else None
        anon_user_id = request.headers.get('X-Anon-User-ID')
        
        if user:
            return PostLike.objects.filter(post=obj, user=user).exists()
        elif anon_user_id:
            return PostLike.objects.filter(post=obj, anon_user_id=anon_user_id).exists()
        return False

    def get_like_id(self, obj):
        request = self.context.get('request')
        user = request.user if request.user.is_authenticated else None
        anon_user_id = request.headers.get('X-Anon-User-ID')
        
        if user:
            like = PostLike.objects.filter(post=obj, user=user).first()
        elif anon_user_id:
            like = PostLike.objects.filter(post=obj, anon_user_id=anon_user_id).first()
        else:
            like = None

        return like.id if like else None

    def get_user_has_hearted(self, obj):
        request = self.context.get('request')
        user = request.user if request.user.is_authenticated else None
        anon_user_id = request.headers.get('X-Anon-User-ID')
        
        if user:
            return PostHeart.objects.filter(post=obj, user=user).exists()
        elif anon_user_id:
            return PostHeart.objects.filter(post=obj, anon_user_id=anon_user_id).exists()
        return False

    def get_heart_id(self, obj):
        request = self.context.get('request')
        user = request.user if request.user.is_authenticated else None
        anon_user_id = request.headers.get('X-Anon-User-ID')
        
        if user:
            heart = PostHeart.objects.filter(post=obj, user=user).first()
        elif anon_user_id:
            heart = PostHeart.objects.filter(post=obj, anon_user_id=anon_user_id).first()
        else:
            heart = None

        return heart.id if heart else None
    
    # def get_user_has_liked(self, obj):
    #     user = self.context['request'].user
    #     if user.is_authenticated:
    #         return PostLike.objects.filter(post=obj, user=user).exists()
    #     else:
    #         anon_user_id = self.context['request'].headers.get('X-Anon-User-ID')
    #         if not anon_user_id:
    #             raise DjangoValidationError("No anonymous user ID provided!!")
    #         return PostLike.objects.filter(post=obj, anon_user=anon_user_id).exists()
    
    
    # def get_like_id(self, obj):
    #     user = self.context['request'].user
    #     if user.is_authenticated:
    #         like = PostLike.objects.filter(post=obj, user=user).first()
    #         return like.id if like else None
    #     else:
    #         anon_user_id = self.context['request'].headers.get('X-Anon-User-ID')
    #         if not anon_user_id:
    #             raise DjangoValidationError("No anonymous user ID provided!!")
    #         like = PostLike.objects.filter(post=obj, anon_user=anon_user_id).first()
    #         return like.id if like else None
        
    # def get_heart_id(self, obj):
    #     user = self.context['request'].user
    #     if user.is_authenticated:
    #         heart = PostHeart.objects.filter(post=obj, user=user).first()
    #         return heart.id if heart else None
    #     else:
    #         anon_user_id = self.context['request'].headers.get('X-Anon-User-ID')
    #         if not anon_user_id:
    #             raise DjangoValidationError("No anonymous user ID provided!!")
    #         heart = PostHeart.objects.filter(post=obj, anon_user=anon_user_id).first()
    #         return heart.id if heart else None

    # def get_user_has_hearted(self, obj):
    #     user = self.context['request'].user
    #     if user.is_authenticated:
    #         return PostHeart.objects.filter(post=obj, user=user).exists()
    #     else:
    #         anon_user_id = self.context['request'].headers.get('X-Anon-User-ID')
    #         if not anon_user_id:
    #             raise DjangoValidationError("No anonymous user ID provided!!")
    #         return PostHeart.objects.filter(post=obj, anon_user=anon_user_id).exists()
    


class PostLikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all(), required=False)
    
    class Meta:
        model = PostLike
        fields = ['id', 'user', 'anon_user', 'post', 'created_at']
        

class PostHeartSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all(), required=False)
    
    class Meta:
        model = PostHeart
        fields = ['id', 'user', 'anon_user', 'post', 'created_at']      
        
          
class CommentLikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    comment = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all(), required=False)
    
    class Meta:
        model = CommentLike
        fields = ['id', 'user', 'anon_user', 'comment']

class CommentDislikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    comment = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all(), required=False)
        
    class Meta:
        model = CommentDislike
        fields = ['id', 'user', 'anon_user', 'comment']
        
class CommentHeartSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    comment = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all(), required=False)
    
    class Meta:
        model = CommentHeart
        fields = ['id', 'user', 'anon_user', 'comment']
        