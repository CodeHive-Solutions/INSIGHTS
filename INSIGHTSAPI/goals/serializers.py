from rest_framework import serializers
from .models import Goals, MultipleGoals

class MultipleGoalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultipleGoals
        fields = '__all__'

class GoalSerializer(serializers.ModelSerializer):
    additional_info = MultipleGoalsSerializer(many=True, read_only=True)
    class Meta:
        model = Goals
        fields = ['cedula','job_title','name','campaign','criteria', 'coordinator', 'quantity','result','evaluation','quality','clean_desk','total','goal_date','execution_date','last_update','accepted','accepted_at','accepted_execution','accepted_execution_at','additional_info']