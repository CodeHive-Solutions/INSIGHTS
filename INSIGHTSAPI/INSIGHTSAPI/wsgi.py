"""
WSGI config for INSIGHTSAPI project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os
import sys
from django.core.wsgi import get_wsgi_application


# * Add the project to the sys.path double dirname because the wsgi.py is inside a folder
path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

if path not in sys.path:
    sys.path.append(path)

sys.path.append(path + "/venv/lib/python3.12/site-packages")


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "INSIGHTSAPI.settings")

application = get_wsgi_application()
