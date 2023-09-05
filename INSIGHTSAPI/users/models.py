# from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
# from django.db import models

# class UserManager(BaseUserManager):
#     def create_user(self, username, rol='user'):
#         if not username or username == '':
#             raise ValueError('Users must have an username')
#         user = self.model(
#             username=username,
#             rol=rol
#         )
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, username, rol='admin'):
#         user = self.create_user(username, rol)
#         user.save()
#         return user

# class User(AbstractBaseUser, PermissionsMixin):
#     username = models.CharField(max_length=150, unique=True)
#     rol = models.CharField(max_length=100)
#     last_login = models.DateTimeField(verbose_name="last login", blank=True, null=True)
#     # password = None
#     last_login = None
#     is_superuser = None

#     objects = UserManager() 

#     USERNAME_FIELD = 'username'
