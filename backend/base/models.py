from django.contrib.auth import get_user_model
from django.db import models
import uuid

User = get_user_model()

class Post (models.Model):
    id = models.IntegerField(db_column='ID', primary_key=True)
    user = models.ForeignKey(User, verbose_name='user', on_delete=models.CASCADE, related_name='userPosts')
    title  = models.CharField(max_length=60, default='', verbose_name='title')
    image = models.CharField(max_length=20, default='', verbose_name='image')
    description = models.CharField(max_length=250, default='', verbose_name='description')
    github_link = models.CharField(max_length=100, default='', verbose_name='github_link')
    website_link = models.CharField(max_length=100, default='', verbose_name='website_link')
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0, verbose_name='likes')
    
    class Meta:
        db_table = 'base_post'
        verbose_name = 'post'
        verbose_name_plural = 'posts'
        
    def __str__ (self):
        return f'{self.id} - {self.nombre}'
    
    
class Anon_User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, blank=True)
    
    class Meta:
        db_table = 'base_anon_user'
        verbose_name = 'anon_user'
        verbose_name_plural = 'anon_users'

    def __str__(self):
        return f"Anónimo {self.id} - {self.name if self.name else 'Sin nombre'}"
    
    
class Like (models.Model):
    id =  models.IntegerField(db_column='ID', primary_key=True)
    user = models.ForeignKey(User, verbose_name='user', on_delete=models.CASCADE, related_name='userLikes')
    post = models.ForeignKey(Post, verbose_name='post', on_delete=models.CASCADE, related_name='postLikes')
    created_at = models.DateTimeField(auto_now_add=True)

        
    class Meta:
        db_table = 'base_like'
        verbose_name = 'like'
        verbose_name_plural = 'likes'
        
    def __str__ (self):
        return f'{self.id} - {self.user}'
    
    
class Comment (models.Model):
    id =  models.IntegerField(db_column='ID', primary_key=True)
    user = models.ForeignKey(User, verbose_name='user', on_delete=models.CASCADE, related_name='userComments')
    post = models.ForeignKey(Post, verbose_name='post', on_delete=models.CASCADE, related_name='postComments')
    content = models.CharField(max_length=250, default='', verbose_name='content')
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0, verbose_name='likes')
        
    class Meta:
        db_table = 'base_comment'
        verbose_name = 'comment'
        verbose_name_plural = 'comments'
        
    def __str__ (self):
        return f'{self.id} - {self.user} - {self.created_at} - {self.content}'