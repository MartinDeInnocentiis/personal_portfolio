from django.contrib.auth.models import User
from django.db import models
import uuid
from django.core.exceptions import ValidationError

    
class Anon_User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, blank=True)
    
    class Meta:
        db_table = 'base_anon_user'
        verbose_name = 'anon_user'
        verbose_name_plural = 'anon_users'

    def __str__(self):
        return f"Anónimo {self.id} - {self.name if self.name else 'Anonymous User'}"
    

class Post (models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)
    user = models.ForeignKey(User, verbose_name='user', on_delete=models.CASCADE, related_name='userPosts')
    title  = models.CharField(max_length=60, default='', verbose_name='title')
    image = models.CharField(max_length=20, default='', verbose_name='image')
    description = models.CharField(max_length=250, default='', verbose_name='description')
    github_link = models.CharField(max_length=100, default='', verbose_name='github_link')
    website_link = models.CharField(max_length=100, default='', verbose_name='website_link')
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.PositiveIntegerField(default=0, verbose_name='likes')
    
    class Meta:
        db_table = 'base_post'
        verbose_name = 'post'
        verbose_name_plural = 'posts'
        
    def __str__ (self):
        return f'{self.id} - {self.title}'
     
    
class PostLike(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)
    user = models.ForeignKey(User, verbose_name='user', on_delete=models.CASCADE, related_name='userLikes', null=True, blank=True)
    anon_user = models.ForeignKey('Anon_User', on_delete=models.CASCADE, related_name='anon_userLikes', null=True, blank=True)
    post = models.ForeignKey(Post, verbose_name='post', on_delete=models.CASCADE, related_name='postLikes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'base_post_like'
        verbose_name = 'post_like'
        verbose_name_plural = 'post_likes'

    def clean(self):
        if not (self.user or self.anon_user):
            raise ValidationError("ERROR: At least one registered or anonymous user must be specified.")

    def __str__(self):
        return f'Like {self.id} by {self.user if self.user else self.anon_user} on POST {self.post.id}'
    
    
class Comment(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)
    user = models.ForeignKey(User, verbose_name='user', on_delete=models.CASCADE, related_name='userComments', null=True, blank=True)
    anon_user = models.ForeignKey('Anon_User', on_delete=models.CASCADE, related_name='anon_userComments', null=True, blank=True)
    post = models.ForeignKey(Post, verbose_name='post', on_delete=models.CASCADE, related_name='postComments')
    content = models.TextField(max_length=250, verbose_name='content', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'base_comment'
        verbose_name = 'comment'
        verbose_name_plural = 'comments'

    def clean(self):
        if not (self.user or self.anon_user):
            raise ValidationError("ERROR: At least one registered or anonymous user must be specified.")

    def __str__(self):
        return f'{self.id} - {self.content[:60]}... - {self.user if self.user else self.anon_user}'
    
    
class CommentLike(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)
    user = models.ForeignKey(User, verbose_name='user', on_delete=models.CASCADE, related_name='comment_likes', null=True, blank=True)
    anon_user = models.ForeignKey('Anon_User', on_delete=models.CASCADE, related_name='anon_comment_likes', null=True, blank=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='likes_from_comment_likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'base_comment_like'
        verbose_name = 'comment like'
        verbose_name_plural = 'comment likes'

    def __str__(self):
        return f'Like {self.id} by {self.user if self.user else self.anon_user} on comment {self.comment.id}'
    
    
class CommentDislike(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)
    user = models.ForeignKey(User, verbose_name='user', on_delete=models.CASCADE, related_name='comment_dislikes', null=True, blank=True)
    anon_user = models.ForeignKey('Anon_User', on_delete=models.CASCADE, related_name='anon_comment_dislikes', null=True, blank=True)
    comment = models.ForeignKey('Comment', on_delete=models.CASCADE, related_name='dislikes_from_comment_dislikes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'base_comment_dislike'
        verbose_name = 'comment dislike'
        verbose_name_plural = 'comment dislikes'

    def __str__(self):
        return f'Dislike {self.id} by {self.user if self.user else self.anon_user} on comment {self.comment.id}'
    
    
class CommentHeart(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)
    user = models.ForeignKey(User, verbose_name='user', on_delete=models.CASCADE, related_name='comment_hearts', null=True, blank=True)
    anon_user = models.ForeignKey('Anon_User', on_delete=models.CASCADE, related_name='anon_comment_hearts', null=True, blank=True)
    comment = models.ForeignKey('Comment', on_delete=models.CASCADE, related_name='hearts_from_comment_hearts')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'base_comment_heart'
        verbose_name = 'comment heart'
        verbose_name_plural = 'comment hearts'

    def __str__(self):
        return f'Heart {self.id} by {self.user if self.user else self.anon_user} on comment {self.comment.id}'
    
    
    