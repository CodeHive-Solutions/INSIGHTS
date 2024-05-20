from rest_framework import serializers
from .models import VacationRequest

class VacationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = VacationRequest
        fields = ['id', 'employee_name', 'start_date', 'end_date', 'reason', 'request_pdf']
