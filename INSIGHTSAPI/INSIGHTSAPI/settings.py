"""
Django settings for INSIGHTSAPI project.

Generated by 'django-admin startproject' using Django 4.2.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

import os
import ssl
import sys
from datetime import datetime, timedelta
from pathlib import Path

import ldap
from django_auth_ldap.config import LDAPSearch, LDAPSearchUnion
from dotenv import load_dotenv

ENV_PATH = Path("/var/env/INSIGHTS.env")

if not os.path.isfile(ENV_PATH):
    raise FileNotFoundError("The env file was not found.")

load_dotenv(ENV_PATH)

# This allows to use the server with a self signed certificate
ssl._create_default_https_context = (
    ssl._create_unverified_context
)  # pylint: disable=protected-access

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
SENDFILE_ROOT = MEDIA_ROOT


# keep the secret key used in production secret!
SECRET_KEY = os.getenv("SECRET_KEY")

# don't run with debug turned on in production!
DEBUG = os.getenv("DEBUG", "False") == "True"


def str_to_bool(value: str) -> bool:
    """Convert a string to a boolean."""
    return value.lower() in ("true", "t", "1")


allowed_hosts_env = os.getenv("ALLOWED_HOSTS", "")

# This is to avoid the error of having an empty string as an allowed host (This is a security risk)
# If the environment variable is an empty string, return an empty list, otherwise split by comma
ALLOWED_HOSTS = (
    [host.strip() for host in allowed_hosts_env.split(",")] if allowed_hosts_env else []
)

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.humanize",
    # "drf_spectacular",
    "debug_toolbar",
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
    "operational_risk",
    "payslip",
    "employment_management",
    "vacation",
    "notifications",
    "carousel_image",
    "coexistence_committee",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "debug_toolbar.middleware.DebugToolbarMiddleware",
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

DEBUG_TOOLBAR_PANELS = [
    "debug_toolbar.panels.timer.TimerPanel",
    "debug_toolbar.panels.sql.SQLPanel",
    "debug_toolbar.panels.cache.CachePanel",
    "debug_toolbar.panels.headers.HeadersPanel",
    "debug_toolbar.panels.request.RequestPanel",
    "debug_toolbar.panels.templates.TemplatesPanel",
    "debug_toolbar.panels.staticfiles.StaticFilesPanel",
    "debug_toolbar.panels.signals.SignalsPanel",
    "debug_toolbar.panels.logging.LoggingPanel",
    "debug_toolbar.panels.redirects.RedirectsPanel",
    "debug_toolbar.panels.profiling.ProfilingPanel",
]

INTERNAL_IPS = ["127.0.0.1"]

REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": [
        # "rest_framework.renderers.BrowsableAPIRenderer",
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": ("api_token.cookie_jwt.CookieJWTAuthentication",),
    # "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}


if not "test" in sys.argv:
    SECURE_SSL_REDIRECT = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_HSTS_SECONDS = 3600
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
# This tell to Django that is behind a proxy
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"

CORS_ORIGIN_ALLOW_ALL = DEBUG
CORS_ALLOW_CREDENTIALS = True


if not DEBUG:
    cors_allowed_origins = os.environ["CORS_ALLOWED_ORIGINS"]
    # This avoid the error of having an empty string as an allowed host (This is a security risk)
    CORS_ALLOWED_ORIGINS = (
        [cors.strip() for cors in cors_allowed_origins.split(",")]
        if cors_allowed_origins
        else []
    )

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

admins = os.getenv("ADMINS", "")

if "test" in sys.argv or ALLOWED_HOSTS[0].find("-dev") != -1:
    ADMINS = []
else:
    ADMINS = (
        [tuple(admin.strip().split(":")) for admin in admins.split(",")]
        if admins
        else []
    )

SERVER_EMAIL = os.environ["SERVER_EMAIL"]
EMAIL_BACKEND = "INSIGHTSAPI.custom.custom_email_backend.CustomEmailBackend"
EMAIL_HOST = os.environ["EMAIL_HOST"]
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = SERVER_EMAIL
EMAIL_HOST_USER = SERVER_EMAIL
EMAIL_HOST_PASSWORD = os.environ["EMAIL_HOST_PASSWORD"]
EMAILS_ETHICAL_LINE = [
    email.strip() for email in os.environ["EMAILS_ETHICAL_LINE"].split(",")
]


# This is the email where the test emails are going to be sent
EMAIL_FOR_TEST = os.getenv("EMAIL_FOR_TEST", "").upper()
# This cédula need to be in the StaffNet database it's used in many tests
TEST_CEDULA = os.environ["TEST_CEDULA"]

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "HOST": os.environ["SERVER_DB"],
        "PORT": "3306",
        "USER": "INSIGHTSUSER",
        "PASSWORD": os.environ["INSIGHTS_DB_PASS"],
        "NAME": "insights",
    },
    "staffnet": {
        "ENGINE": "django.db.backends.mysql",
        "HOST": os.environ["SERVER_DB"],
        "PORT": "3306",
        "USER": "INSIGHTSUSER",
        "PASSWORD": os.environ["INSIGHTS_DB_PASS"],
        "NAME": "staffnet",
        "TEST": {"MIRROR": "staffnet"},
    },
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

LANGUAGE_CODE = "es-co"

TIME_ZONE = "America/Bogota"

USE_I18N = True

USE_L10N = True

USE_THOUSAND_SEPARATOR = True

USE_TZ = False

AUTHENTICATION_BACKENDS = [
    "django_auth_ldap.backend.LDAPBackend",
    "api_token.cookie_jwt.CustomAuthBackend",
    "django.contrib.auth.backends.ModelBackend",
]


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "static"
# STATICFILES_DIRS = [
# os.path.join(BASE_DIR, "static"),
# ]

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
        "mail_admins": {
            "level": "ERROR",
            "class": "django.utils.log.AdminEmailHandler",
            "include_html": True,
        },
        "celery": {
            "level": "INFO",
            "class": "logging.FileHandler",
            "filename": os.path.join(log_dir, "celery.log"),
            "formatter": "time-lvl-msg",
        },
    },
    "loggers": {
        "requests": {
            "handlers": ["response_file", "exception_file", "mail_admins"],
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
        "celery": {
            "handlers": ["celery"],
            "level": "INFO",
            "propagate": True,
        },
    },
    "root": {
        "handlers": ["exception_file", "mail_admins"],
        "level": "ERROR",
    },
}

AUTH_USER_MODEL = "users.User"

# LDAP configuration
AUTH_LDAP_SERVER_URI = "ldap://CYC-SERVICES.COM.CO:389"
AUTH_LDAP_BIND_DN = "CN=StaffNet,OU=TECNOLOGÍA,OU=BOGOTA,DC=CYC-SERVICES,DC=COM,DC=CO"
AUTH_LDAP_BIND_PASSWORD = os.environ["AdminLDAPPassword"]

# AUTH_LDAP_USER_SEARCH = LDAPSearch(
#     "OU=BOGOTA,DC=CYC-SERVICES,DC=COM,DC=CO",  # Search base
#     ldap.SCOPE_SUBTREE,  # Search scope
#     "(&(objectClass=user)(sAMAccountName=%(user)s))",  # Search filter
# )

AUTH_LDAP_USER_SEARCH = LDAPSearchUnion(
    LDAPSearch(
        "OU=BOGOTA,DC=CYC-SERVICES,DC=COM,DC=CO",  # Search base
        ldap.SCOPE_SUBTREE,  # Search scope
        "(&(objectClass=user)(sAMAccountName=%(user)s))",  # Search filter
    ),
    LDAPSearch(
        "OU=MEDELLIN,DC=CYC-SERVICES,DC=COM,DC=CO",  # Search base
        ldap.SCOPE_SUBTREE,  # Search scope
        "(&(objectClass=user)(sAMAccountName=%(user)s))",  # Search filter
    ),
    LDAPSearch(
        "OU=BUCARAMANGA,DC=CYC-SERVICES,DC=COM,DC=CO",  # Search base
        ldap.SCOPE_SUBTREE,  # Search scope
        "(&(objectClass=user)(sAMAccountName=%(user)s))",  # Search filter
    ),
    LDAPSearch(
        "OU=VILLAVICENCIO,DC=CYC-SERVICES,DC=COM,DC=CO",  # Search base
        ldap.SCOPE_SUBTREE,  # Search scope
        "(&(objectClass=user)(sAMAccountName=%(user)s))",  # Search filter
    ),
)

AUTH_LDAP_USER_ATTR_MAP = {
    "first_name": "givenName",
    "last_name": "sn",
}

AUTH_LDAP_ALWAYS_UPDATE_USER = False

# This works faster in ldap but i don't know how implement it with the sAMAcountName
# AUTH_LDAP_USER_DN_TEMPLATE =
#'CN=Heibert Steven Mogollon Mahecha,OU=IT,OU=BOGOTA,DC=CYC-SERVICES,DC=COM,DC=CO'

# AUTH_LDAP_USER_DN_TEMPLATE =
#'(sAMAccountName=%(user)s),OU=IT,OU=BOGOTA,DC=CYC-SERVICES,DC=COM,DC=CO'

if DEBUG:
    SENDFILE_BACKEND = "django_sendfile.backends.development"
else:
    SENDFILE_BACKEND = "django_sendfile.backends.simple"

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15) if not DEBUG else timedelta(hours=8),
    "REFRESH_TOKEN_LIFETIME": timedelta(hours=1),
    "ROTATE_REFRESH_TOKENS": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    # "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),
    # "SLIDING_TOKEN_LIFETIME": timedelta(days=30),
    # "SLIDING_TOKEN_REFRESH_ON_LOGIN": True,
    # "SLIDING_TOKEN_REFRESH_ON_REFRESH": True,
    # "AUTH_COOKIE": "access-token",
    # "USER_AUTHENTICATION_RULE": "api_token.cookie_jwt.always_true",
}

# Celery configuration for the tasks
CELERY_HIJACK_ROOT_LOGGER = False
CELERY_BROKER_URL = "redis://localhost:6379/1"
CELERY_RESULT_BACKEND = "redis://localhost:6379/1"
CELERY_BROKER_CONNECTION_RETRY_ON_STARTUP = True
CELERY_TIMEZONE = "UTC"
CELERY_LOG_FILE = os.path.join(log_dir, "celery.log")
CELERY_LOG_LEVEL = "INFO"
CELERY_BEAT_HEARTBEAT = 10  # How often the scheduler checks if a task is due


CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/0",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
        "KEY_PREFIX": "insights",
    }
}
