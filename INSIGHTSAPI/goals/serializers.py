from rest_framework import serializers
from simple_history.models import HistoricalRecords
from .models import Goals, TableInfo


class TableInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableInfo
        fields = "__all__"


class GoalSerializer(serializers.ModelSerializer):
    # table_goal_id = serializers.PrimaryKeyRelatedField(source='table_goal', queryset=TableInfo.objects.all())
    # table_name = TableNameSerializer(read_only=True)
    history_date = serializers.DateTimeField(read_only=True)
    additional_info = serializers.SerializerMethodField()
    accepted = serializers.BooleanField(read_only=True)
    accepted_at = serializers.DateTimeField(read_only=True)
    accepted_execution = serializers.BooleanField(read_only=True)
    accepted_execution_at = serializers.DateTimeField(read_only=True)
    last_update = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Goals
        fields = [
            "cedula",
            "job_title_goal",
            "job_title_execution",
            "name",
            "campaign_goal",
            "campaign_execution",
            "criteria_goal",
            "criteria_execution",
            "coordinator_goal",
            "coordinator_execution",
            "quantity_goal",
            "quantity_execution",
            "result",
            "evaluation",
            "quality",
            "clean_desk",
            "total",
            "goal_date",
            "execution_date",
            "last_update",
            "accepted",
            "accepted_at",
            "accepted_execution",
            "accepted_execution_at",
            "table_goal",
            "observation_goal",
            "observation_execution",
            "history_date",
            "additional_info",
        ]
        # fields = '__all__'

    def get_additional_info(self, obj):
        # Retrieve all TableInfo instances with the same name as obj.table_goal
        # table_info_instances = TableInfo.objects.filter(name=obj.table_goal)
        table_info_instances = TableInfo.objects.filter(name=obj.table_goal)

        # Serialize the TableInfo instances to a list of dictionaries
        serialized_table_info = TableInfoSerializer(
            table_info_instances, many=True
        ).data

        return serialized_table_info
