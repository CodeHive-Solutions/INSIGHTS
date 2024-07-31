"""This module contains the models for the services app. """

from django.db import models


# Create your models here.
class Question(models.Model):
    """Model for a question."""

    question = models.CharField(max_length=255)
    correct_answer = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question


class Answer(models.Model):
    """Model for an answer."""

    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.answer

    def save(self, *args, **kwargs):
        if self.answer == self.question.correct_answer:
            self.is_correct = True
        super().save(*args, **kwargs)
