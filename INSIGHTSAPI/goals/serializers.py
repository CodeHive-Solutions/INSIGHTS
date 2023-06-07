from rest_framework import serializers
from .models import Goal, PersonGoals

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['campaign', 'value','created_at']

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonGoals
        fields = ['cedula','job_title','name','campaign','result','evaluation','quality','clean_desk','total']