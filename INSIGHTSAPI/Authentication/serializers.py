from rest_framework import serializers

class LDAPAuthSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()