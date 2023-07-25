"""
Django settings for INSIGHTSAPI project.

Generated by 'django-admin startproject' using Django 4.2.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
from dotenv import load_dotenv
import os
import ssl

if not os.path.isfile('/var/env/INSIGHTS.env'):
    raise FileNotFoundError('The env file was not found.')

load_dotenv("/var/env/INSIGHTS.env")

ssl._create_default_https_context = ssl._create_unverified_context

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-01_50pjn@2&6dy%6ze562l3)&%j_z891auca!#c#xb+#$z+pqf'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ["172.16.0.114", "172.16.5.10", "172.16.5.11", "127.0.0.1", "172.16.0.115", "localhost", "insights-api.cyc-bpo.com","insights-api-dev.cyc-bpo.com"]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'simple_history',
    'corsheaders',
    'rest_framework',
    'goals'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'INSIGHTSAPI.middleware.logging.LoggingMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ORIGIN_ALLOW_ALL = True

CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
    'http://localhost:8000',
]

ROOT_URLCONF = 'INSIGHTSAPI.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI_APPLICATION = 'INSIGHTSAPI.wsgi.application'

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'mail.cyc-services.com.co'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'mismetas@cyc-services.com.co'
EMAIL_HOST_PASSWORD = os.getenv('C_2023')
DEFAULT_FROM_EMAIL = 'mismetas@cyc-services.com.co'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'HOST': '172.16.0.118',
        # 'HOST': '172.16.0.115',
        'PORT': '3306',
        'USER': 'INSIGHTSUSER',
        'PASSWORD': os.getenv('MYSQL_118'),
        # 'PASSWORD': os.getenv('MYSQL_115'),
        'NAME': 'insights',
    },
    # '172.16.0.6': {
    #     'ENGINE': 'django.db.backends.mysql',
    #     'HOST': '172.16.0.6',
    #     'PORT': '3306',
    #     'USER': 'root',
    #     'PASSWORD': os.getenv('LEYES'),
    #     'NAME': 'userscyc'
    # }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/Bogota'

USE_I18N = True

USE_TZ = False

AUTHENTICATION_BACKENDS = [
    # Add other authentication backends as needed
    'django.contrib.auth.backends.ModelBackend',
]


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ]
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'time-lvl-msg': {
            'format': '%(asctime)s - %(levelname)s - %(message)s',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
        },
        'response_file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/var/www/INSIGHTS/INSIGHTSAPI/utils/logs/requests.log',
            'formatter': 'time-lvl-msg',
        },
        'exception_file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/www/INSIGHTS/INSIGHTSAPI/utils/logs/exceptions.log',
            'formatter': 'time-lvl-msg',
        },
    },
    'loggers': {
        'requests': {
            'handlers': ['response_file', 'exception_file'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'console': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True,
        },
        'django.request': {
            'handlers': ['exception_file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'formatters': {
#         'time-lvl-msg': {
#             'format': '%(asctime)s - %(levelname)s - %(message)s',
#         },
#     },
#     'handlers': {
#         'console': {
#             'level': 'INFO',
#             'class': 'logging.StreamHandler',
#         },
#         'request_file': {
#             'level': 'INFO',
#             'class': 'logging.FileHandler',
#             'filename': '/var/www/INSIGHTSAPI/utils/logs/requests.log',
#             'formatter': 'time-lvl-msg',
#         },
#         'exception_file': {
#             'level': 'ERROR',
#             'class': 'logging.FileHandler',
#             'filename': '/var/www/INSIGHTSAPI/utils/logs/exceptions.log',
#             'formatter': 'time-lvl-msg',
#         },
#     },
#     'loggers': {
#         'django': {
#             'handlers': ['console'],
#             'level': 'INFO',
#             'propagate': True,
#         },
#         'django.request': {
#             'handlers': ['exception_file'],
#             'level': 'INFO',
#             'propagate': False,
#         },
#         'goals.views': {
#             'handlers': ['request_file'],
#             'level': 'INFO',
#             'propagate': True,
#         },
#     },
# }
