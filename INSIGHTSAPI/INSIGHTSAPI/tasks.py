from celery import shared_task


@shared_task
def add_numbers(x, y):
    return x + y
