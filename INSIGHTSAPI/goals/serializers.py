from rest_framework import serializers
from .models import Goals, MultipleGoals

class MultipleGoalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultipleGoals
        fields = '__all__'

class GoalSerializer(serializers.ModelSerializer):
    additional_info = MultipleGoalsSerializer(many=True)
    class Meta:
        model = Goals
        fields = ['cedula','job_title','name','campaign','criteria', 'coordinator', 'quantity','result','evaluation','quality','clean_desk','total','last_update', 'accepted_at', 'accepted_execution_at', 'accepted', 'accepted_execution','additional_info']