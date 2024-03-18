from celery import Celery

app = Celery(
    "INSIGHTSAPI",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
)

app.conf.broker_connection_retry_on_startup = True

# Optional configuration, see the Celery documentation for more options.
app.conf.timezone = "UTC"
