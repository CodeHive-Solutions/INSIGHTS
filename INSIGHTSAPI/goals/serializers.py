from rest_framework import serializers
from .models import Goals, TableInfo, TableName

class TableInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableInfo
        fields = '__all__'

class TableNameSerializer(serializers.ModelSerializer):
    table_info = TableInfoSerializer(read_only=True)

    class Meta:
        model = TableName
        fields = ['table_info']

class GoalSerializer(serializers.ModelSerializer):
    table_name = TableNameSerializer(read_only=True)
    accepted = serializers.BooleanField(read_only=True)
    accepted_at = serializers.DateTimeField(read_only=True)
    accepted_execution = serializers.BooleanField(read_only=True)
    accepted_execution_at = serializers.DateTimeField(read_only=True)
    last_update = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Goals
        fields = ['cedula','job_title','name','campaign','criteria', 'coordinator', 'quantity','result','evaluation','quality','clean_desk','total','goal_date','execution_date','last_update','accepted','accepted_at','accepted_execution','accepted_execution_at','table_name']