# In your Django app's views.py

import sys
import logging
from django.db import connections
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from mysql.connector import Error
from .models import User

logger = logging.getLogger("requests")

@api_view(['POST'])
@login_required
def update_user(request):
    try:
        # Connect to the non-Django app's database
        with connections['staffnet'].cursor() as cursor:
            # Dynamically construct the SQL query
            query = 'UPDATE personal_information SET '
            for key, value in request.POST.items():
                query += f'{key} = "{value}", '
            query = query[:-2] + ' WHERE cedula = %s'
            # Execute the query
            if 'test' in sys.argv:
                cursor.execute(query, (request.user.cedula,))
        return Response({'message': 'User updated successfully'})
    except Error as e:
        logger.error(f'Error: {e}')
        return Response({'message': f'Error: interno'}, status=500)

@api_view(['GET'])
@login_required
def get_users(request):
    user_rank = request.user.job_position.rank
    if user_rank >= 6:
        # Get all users that have a lower rank than the current user
        users = User.objects.filter(job_position__rank__lt=user_rank)
    else:
        # Get all users that have a lower rank than the current user and are in the same area
        users = User.objects.filter(job_position__rank__lt=user_rank, area=request.user.area)
    # Serialize the users
    data = [{'id': user.id, 'name': user.get_full_name()} for user in users]
    return Response(data)