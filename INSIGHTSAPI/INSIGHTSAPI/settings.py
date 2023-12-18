"""
Django settings for INSIGHTSAPI project.

Generated by 'django-admin startproject' using Django 4.2.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from datetime import timedelta, datetime
from pathlib import Path
import os
import ssl
import ldap  # type: ignore
from django_auth_ldap.config import LDAPSearch  # type: ignore
from dotenv import load_dotenv


ENV_PATH = Path("/var/env/INSIGHTS.env")

if not os.path.isfile(ENV_PATH):
    raise FileNotFoundError("The env file was not found.")

load_dotenv(ENV_PATH)

# This allows to use the server with a self signed certificate
ssl._create_default_https_context = ssl._create_unverified_context

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "static"

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-01_50pjn@2&6dy%6ze562l3)&%j_z891auca!#c#xb+#$z+pqf"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True if os.getenv("DEBUG") is not None else False

if DEBUG:
    ALLOWED_HOSTS = ["insights-api-dev.cyc-bpo.com"]
else:
    ALLOWED_HOSTS = ["insights-api.cyc-bpo.com"]

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "django_auth_ldap",
    "simple_history",
    "rest_framework",
    "goals",
    "api_token",
    "hierarchy",
    "sgc",
    "users",
    "excels_processing",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "INSIGHTSAPI.middleware.logging.LoggingMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": ("api_token.cookie_JWT.CookieJWTAuthentication",),
    # 'DEFAULT_PERMISSION_CLASSES': [
    #     'rest_framework.permissions.IsAuthenticated',
    # ],
}

CORS_ORIGIN_ALLOW_ALL = DEBUG
CORS_ALLOW_CREDENTIALS = True


if not DEBUG:
    CORS_ALLOWED_ORIGINS = [
        "https://insights.cyc-bpo.com",
    ]

ROOT_URLCONF = "INSIGHTSAPI.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "mail.cyc-services.com.co"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
# EMAIL_HOST_USER = "mismetas@cyc-services.com.co"
# EMAIL_HOST_PASSWORD = os.environ["C_2023"]
# DEFAULT_FROM_EMAIL = "mismetas@cyc-services.com.co"

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "HOST": os.environ["SERVER_DB"],
        "PORT": "3306",
        "USER": "INSIGHTSUSER",
        "PASSWORD": os.environ["INSIGHTSMYSQL"],
        "NAME": "insights",
    },
    "staffnet": {
        "ENGINE": "django.db.backends.mysql",
        "HOST": os.environ["SERVER_DB"],
        "PORT": "3306",
        "USER": "INSIGHTSUSER",
        "PASSWORD": os.environ["INSIGHTSMYSQL"],
        "NAME": "staffnet",
        "TEST": {"MIRROR": "staffnet"},
    },
    # 'llamadas': {  # MySQL too old
    #     'ENGINE': 'django.db.backends.mysql',
    #     'HOST': '172.16.0.9',
    #     'PORT': '3306',
    #     'USER': 'blacklistuser',
    #     # 'PASSWORD': os.environ['black_list_pass'],
    #     'PASSWORD': 'a4dnAGc-',
    #     'NAME': 'asteriskdb',
    # }
    # 'intranet': { # MySQL too old
    #     "user": "mtc",
    #     "password": os.environ["LEYES"],
    #     "host": "172.16.0.6",
    #     "port": "3306",
    #     "database": "userscyc",
    #  }
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

# AUTH_PASSWORD_VALIDATORS = [
#     {
#         "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
#     },
#     {
#         "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
#     },
#     {
#         "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
#     },
#     {
#         "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
#     },
# ]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "America/Bogota"

USE_I18N = True

USE_TZ = False

AUTHENTICATION_BACKENDS = [
    "django_auth_ldap.backend.LDAPBackend",
    "django.contrib.auth.backends.ModelBackend",
]


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

log_dir = os.path.join(BASE_DIR, "utils", "logs")

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "time-lvl-msg": {
            "format": "%(asctime)s - %(levelname)s - %(message)s",
        },
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
        },
        "response_file": {
            "level": "INFO",
            "class": "logging.FileHandler",
            "filename": os.path.join(log_dir, "requests.log"),
            "formatter": "time-lvl-msg",
        },
        "exception_file": {
            "level": "ERROR",
            "class": "logging.FileHandler",
            "filename": os.path.join(log_dir, "exceptions.log"),
            "formatter": "time-lvl-msg",
        },
    },
    "loggers": {
        "requests": {
            "handlers": ["response_file", "exception_file"],
            "level": "DEBUG",
            "propagate": True,
        },
        "console": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": True,
        },
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": True,
        },
        "django.request": {
            "handlers": ["exception_file"],
            "level": "INFO",
            "propagate": False,
        },
        "django_auth_ldap": {
            "handlers": ["console", "response_file", "exception_file"],
            "level": "INFO",
            "propagate": True,
        },
    },
}

AUTH_USER_MODEL = "users.User"

# LDAP configuration
AUTH_LDAP_SERVER_URI = "ldap://CYC-SERVICES.COM.CO:389"
AUTH_LDAP_BIND_DN = "CN=StaffNet,OU=TECNOLOGÍA,OU=BOGOTA,DC=CYC-SERVICES,DC=COM,DC=CO"
AUTH_LDAP_BIND_PASSWORD = os.getenv("Adminldap")

AUTH_LDAP_USER_SEARCH = LDAPSearch(
    "OU=BOGOTA,DC=CYC-SERVICES,DC=COM,DC=CO",  # Search base
    ldap.SCOPE_SUBTREE,  # Search scope
    "(sAMAccountName=%(user)s)",  # Search filter
)

AUTH_LDAP_USER_ATTR_MAP = {
    "first_name": "givenName",
    "last_name": "sn",
}

# This works faster in ldap but i don't know how implement it with the sAMAcountName
# AUTH_LDAP_USER_DN_TEMPLATE = 'CN=Heibert Steven Mogollon Mahecha,OU=IT,OU=BOGOTA,DC=CYC-SERVICES,DC=COM,DC=CO'

# AUTH_LDAP_USER_DN_TEMPLATE = '(sAMAccountName=%(user)s),OU=IT,OU=BOGOTA,DC=CYC-SERVICES,DC=COM,DC=CO'

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=15),
    # "ACCESS_TOKEN_LIFETIME": timedelta(seconds=10),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),
    "SLIDING_TOKEN_LIFETIME": timedelta(days=30),
    "SLIDING_TOKEN_REFRESH_ON_LOGIN": True,
    "SLIDING_TOKEN_REFRESH_ON_REFRESH": True,
    "AUTH_COOKIE": "access-token",
    "USER_AUTHENTICATION_RULE": "api_token.cookie_JWT.always_true",
}
