# Generated by Django 5.0.6 on 2024-06-24 21:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_alter_anon_user_name_alter_comment_content'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='website_link',
            field=models.CharField(blank=True, default='', max_length=100, null=True, verbose_name='website_link'),
        ),
    ]
