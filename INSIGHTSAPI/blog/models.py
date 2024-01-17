"""This file contains the models for the blog app. """
from django.db import models


class BlogPost(models.Model):
    """This class represents a blog post."""

    title = models.CharField(max_length=100)
    content = models.TextField()
    date_posted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """This method returns a string representation of the blog post."""
        return str(self.title)

    def formatted_content(self):
        """This method returns the content field with html formatting."""
        return self.content.replace("\n", "<br>")
