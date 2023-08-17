from rest_framework import serializers
from .models import Goals, TableInfo

class TableGoalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableInfo
        fields = '__all__'

class GoalSerializer(serializers.ModelSerializer):
    table_goal = TableGoalsSerializer()

    class Meta:
        model = Goals
        fields = ['cedula','job_title','name','campaign','criteria', 'coordinator', 'quantity','result','evaluation','quality','clean_desk','total','goal_date','execution_date','last_update','accepted','accepted_at','accepted_execution','accepted_execution_at','table_goal_id']