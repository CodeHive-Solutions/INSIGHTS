# Generated by Django 4.2.5 on 2023-11-29 09:27

import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import users.models


class Migration(migrations.Migration):

    replaces = [('users', '0001_initial'), ('users', '0002_user_password'), ('users', '0003_alter_user_managers'), ('users', '0004_alter_user_managers'), ('users', '0005_remove_user_cedula'), ('users', '0006_user_cedula')]

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('hierarchy', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('profile_picture', models.ImageField(upload_to='images/pictures/', validators=[users.models.validate_file_extension])),
                ('job_title', models.CharField(blank=True, max_length=100, null=True)),
                ('area', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='users', to='hierarchy.area')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
                ('password', models.CharField(default='', max_length=128, verbose_name='password')),
                ('cedula', models.IntegerField(default='', unique=True)),
            ],
            options={
                'permissions': [('upload_robinson_list', 'Can upload robinson list')],
            },
        ),
    ]
