# Generated by Django 5.0.7 on 2024-09-09 16:51

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Banner',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('link', models.URLField(blank=True, null=True)),
                ('active', models.BooleanField(default=True)),
                ('image', models.ImageField(upload_to='carousel_images/banners/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
