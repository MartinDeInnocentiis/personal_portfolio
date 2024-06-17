from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()

class Post (models.Model):
    id = models.IntegerField(db_column='ID', primary_key=True)
    user = models.ForeignKey(User, verbose_name='user', on_delete=models.CASCADE, related_name='userPosts')
    title  = models.CharField(max_length=60, default='', verbose_name='title')
    description = models.CharField(max_length=250, default='', verbose_name='description')
    github_link = models.CharField(max_length=100, default='', verbose_name='github_rep')
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    class Meta:
        db_table = 'base_post'
        verbose_name = 'post'
        verbose_name_plural = 'posts'
        
    def __str__ (self):
        return f'{self.id} - {self.nombre}'
    
    
#class Anon_User(models.Model):
    
    
    
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
        return f'{self.id} - {self.nombre}'
    
    
class Comment (models.Model):
    id =  models.IntegerField(db_column='ID', primary_key=True)
    user = models.ForeignKey(User, verbose_name='user', on_delete=models.CASCADE, related_name='userComments')
    post = models.ForeignKey(Post, verbose_name='post', on_delete=models.CASCADE, related_name='postComments')
    like = models.ForeignKey(Like, verbose_name='like', on_delete=models.CASCADE, related_name='likeComments')
    content = models.CharField(max_length=250, default='', verbose_name='content')
    created_at = models.DateTimeField(auto_now_add=True)

        
    class Meta:
        db_table = 'base_comment'
        verbose_name = 'comment'
        verbose_name_plural = 'comments'
        
    def __str__ (self):
        return f'{self.id} - {self.nombre}'