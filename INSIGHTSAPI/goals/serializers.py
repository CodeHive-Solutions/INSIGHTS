from rest_framework import serializers
from .models import Goals, TableInfo

class TableInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableInfo
        fields = '__all__'


class GoalSerializer(serializers.ModelSerializer):
    # table_goal_id = serializers.PrimaryKeyRelatedField(source='table_goal', queryset=TableInfo.objects.all())
    # table_name = TableNameSerializer(read_only=True)
    additional_info = serializers.SerializerMethodField()
    accepted = serializers.BooleanField(read_only=True)
    accepted_at = serializers.DateTimeField(read_only=True)
    accepted_execution = serializers.BooleanField(read_only=True)
    accepted_execution_at = serializers.DateTimeField(read_only=True)
    last_update = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Goals
        fields = ['cedula','job_title','name','campaign','criteria', 'coordinator', 'quantity','result','evaluation','quality','clean_desk','total','goal_date','execution_date','last_update','accepted','accepted_at','accepted_execution','accepted_execution_at','table_goal','observation','additional_info']
        # fields = '__all__'

    def get_additional_info(self, obj):
        # Retrieve all TableInfo instances with the same name as obj.table_goal
        # table_info_instances = TableInfo.objects.filter(name=obj.table_goal)
        table_info_instances = TableInfo.objects.filter(name=obj.table_goal)
        
        # Serialize the TableInfo instances to a list of dictionaries
        serialized_table_info = TableInfoSerializer(table_info_instances, many=True).data
        
        return serialized_table_info