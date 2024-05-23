from rest_framework import serializers
from .models import VacationRequest

class VacationRequestSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = VacationRequest
        fields = '__all__'

    def validate(self, data):
        if data["start_date"] > data["end_date"]:
            raise serializers.ValidationError("La fecha de inicio no puede ser mayor a la fecha de fin.")
        return data