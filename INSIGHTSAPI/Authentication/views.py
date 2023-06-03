from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .serializers import LDAPAuthSerializer

class LDAPAuthView(APIView):
    def post(self, request):
        serializer = LDAPAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(request, username=username, password=password)

        if user is not None:
            # Authentication successful
            response_data = {'status': 'success', 'message': 'Authentication successful'}
        else:
            # Authentication failed
            response_data = {'status': 'failure', 'message': user}
        return Response(response_data)
