import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "INSIGHTSAPI.settings")
app = Celery(
    "INSIGHTSAPI",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
)

app.conf.broker_url = "redis://localhost:6379/0"
app.conf.broker_connection_retry_on_startup = True

# Optional configuration, see the Celery documentation for more options.
app.conf.timezone = "UTC"

app.autodiscover_tasks(["INSIGHTSAPI"])