# Generated by Django 5.0.6 on 2024-07-23 20:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0008_alter_comment_content_alter_post_github_link_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='stack',
            field=models.CharField(default='', max_length=450, verbose_name='stack'),
        ),
        migrations.AddField(
            model_name='post',
            name='summary',
            field=models.CharField(default='', max_length=1250, verbose_name='summary'),
        ),
    ]