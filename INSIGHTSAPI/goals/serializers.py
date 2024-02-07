"""Serializers for the goals app."""
from rest_framework import serializers
from simple_history.models import HistoricalRecords
from .models import Goals, TableInfo


class TableInfoSerializer(serializers.ModelSerializer):
    """Serializer for the TableInfo model."""
    class Meta:
        """Meta class for the TableInfoSerializer."""
        model = TableInfo
        fields = "__all__"


class GoalSerializer(serializers.ModelSerializer):
    """Serializer for the Goal model."""
    # Put the read_only in the meta class don't work for history_date and last_update
    history_date = serializers.DateTimeField(read_only=True)
    additional_info = serializers.SerializerMethodField()
    accepted = serializers.BooleanField()
    accepted_at = serializers.DateTimeField()
    accepted_execution = serializers.BooleanField()
    accepted_execution_at = serializers.DateTimeField()
    last_update = serializers.DateTimeField(read_only=True)

    class Meta:
        """Meta class for the GoalSerializer."""
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
        read_only_fields = [
            # "last_update",
            "accepted_at",
            "accepted_execution_at",
            # "history_date",
            "additional_info",
        ]

    def get_additional_info(self, obj):
        """Return the TableInfo of the goal."""
        table_info_instances = TableInfo.objects.filter(name=obj.table_goal)

        # Serialize the TableInfo instances to a list of dictionaries
        serialized_table_info = TableInfoSerializer(
            table_info_instances, many=True
        ).data

        return serialized_table_info
