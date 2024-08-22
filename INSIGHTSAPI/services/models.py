"""This module contains the models for the services app. """

from django.db import models

class Answer(models.Model):
    """Model for an answer."""

    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    question_1 = models.CharField(max_length=255)
    question_2 = models.CharField(max_length=255)
    question_3 = models.CharField(max_length=255)
    duration = models.DurationField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "Answer for {}".format(self.user.username)
