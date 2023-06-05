from rest_framework import serializers
from .models import Goal

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['campaign', 'value','created_at']

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['campaign', 'value','created_at']