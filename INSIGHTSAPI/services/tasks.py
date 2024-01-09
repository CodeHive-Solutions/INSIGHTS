# scheduler/tasks.py
import time
import schedule
from django.core.management.base import BaseCommand
from django.utils import timezone


def your_periodic_task():
    # Your task logic here
    print("Task executed at", timezone.now())


# Schedule the task to run every 5 minutes
schedule.every(5).seconds.do(your_periodic_task)

while True:
    schedule.run_pending()
    time.sleep(1)
