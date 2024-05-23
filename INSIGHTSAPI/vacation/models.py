from distutils.command import upload
from django.db import models


class VacationRequest(models.Model):
    employee_name = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    request_file = models.FileField(upload_to="vacation_requests/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey("users.User", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.employee_name} - {self.start_date} to {self.end_date}"
