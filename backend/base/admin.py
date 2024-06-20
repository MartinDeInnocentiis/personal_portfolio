from django.contrib import admin
from base.models import *


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'title', 'image', 'description', 'github_link', 'website_link', 'created_at', 'likes']
    
@admin.register(Anon_User)
class Anon_UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    
@admin.register(PostLike)
class PostLikeAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'anon_user', 'post', 'created_at']
    

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'anon_user', 'post', 'content', 'created_at']
  
@admin.register(CommentLike)
class CommentLikeAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'anon_user', 'comment', 'created_at']
  
@admin.register(CommentDislike)
class CommentDislikeAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'anon_user', 'comment', 'created_at']
  
@admin.register(CommentHeart)
class CommentHeartAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'anon_user', 'comment', 'created_at']
  
