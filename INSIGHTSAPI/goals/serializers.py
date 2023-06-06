from rest_framework import serializers
from .models import Goal, Person

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['campaign', 'value','created_at']

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['cedula', 'name','campaign','evaluation','quality','cleand_desk','total']