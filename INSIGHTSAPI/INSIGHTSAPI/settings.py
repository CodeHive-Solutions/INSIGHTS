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
import sys


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
SENDFILE_ROOT = MEDIA_ROOT


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True if os.getenv("DEBUG") is not None else False
# DEBUG = False


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
    "contracts",
    "users",
    "excels_processing",
    "pqrs",
    "django_sendfile",
    "services",
    "blog",
    "vacancy",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "INSIGHTSAPI.middleware.logger.LoggingMiddleware",
    "simple_history.middleware.HistoryRequestMiddleware",
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


if not "test" in sys.argv:
    SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SECURE_HSTS_SECONDS = 3600
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

CORS_ORIGIN_ALLOW_ALL = DEBUG
CORS_ALLOW_CREDENTIALS = True


if not DEBUG:
    CORS_ALLOWED_ORIGINS = [
        "https://intranet.cyc-bpo.com",
        "https://staffnet-api.cyc-bpo.com",
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

EMAIL_BACKEND = "INSIGHTSAPI.custom.email_backend.CustomEmailBackend"
EMAIL_HOST = "mail.cyc-services.com.co"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "no-reply@cyc-services.com.co"
EMAIL_HOST_PASSWORD = os.environ["TecPlusLess"]

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
    #     "user": "root",
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

LANGUAGE_CODE = "es-CO"

TIME_ZONE = "America/Bogota"

USE_I18N = True

USE_L10N = True

USE_THOUSAND_SEPARATOR = True

USE_TZ = False

AUTHENTICATION_BACKENDS = [
    "django_auth_ldap.backend.LDAPBackend",
    "api_token.cookie_JWT.CustomAuthBackend",
    "django.contrib.auth.backends.ModelBackend",
]


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "static"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

log_dir = os.path.join(BASE_DIR, "utils", "logs")
# Create another log file for each minute
now = datetime.now()
year_month = now.strftime("%Y-%B")
month = now.strftime("%B")
# Create the log file
if not os.path.exists(os.path.join(log_dir, year_month)):
    os.makedirs(os.path.join(log_dir, year_month))
# Set the log directory


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
            "filename": os.path.join(log_dir, year_month, f"requests_{month}.log"),
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
            "level": "DEBUG",
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

if DEBUG:
    SENDFILE_BACKEND = "django_sendfile.backends.development"
else:
    SENDFILE_BACKEND = "django_sendfile.backends.simple"

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
