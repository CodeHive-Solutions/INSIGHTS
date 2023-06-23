from rest_framework import serializers
from .models import Goals

# class GoalSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Goal
#         fields = ['campaign', 'value','created_at']

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goals
        fields = ['cedula','job_title','name','campaign','criteria', 'coordinator', 'quantity','result','evaluation','quality','clean_desk','total','created_at', 'accepted_at', 'accepted_execution_at', 'accepted', 'accepted_execution']