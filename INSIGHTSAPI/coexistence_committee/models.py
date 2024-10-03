from django.db import models


# Create your models here.
class Reason(models.Model):
    reason = models.CharField(max_length=200)
    attendant = models.ForeignKey("hierarchy.JobPosition", on_delete=models.RESTRICT)

    def __str__(self):
        return self.reason


class Complaint(models.Model):
    reason = models.ForeignKey(Reason, on_delete=models.RESTRICT)
    description = models.TextField()

    def __str__(self):
        return self.description
