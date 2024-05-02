# In your Django app's views.py

import sys
import logging
from django.db import connections
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from mysql.connector import Error

logger = logging.getLogger("requests")

@api_view(['POST'])
@login_required
def update_user(request):
    try:
        # Connect to the non-Django app's database
        with connections['staffnet'].cursor() as cursor:
            # Dynamically construct the SQL query
            query = 'UPDATE users SET '
            for key, value in request.POST.items():
                query += f'{key} = "{value}", '
            query = query[:-2] + ' WHERE id = %s'
            # Execute the query
            print(query)
            if 'test' not in sys.argv:
                cursor.execute(query, (request.user.cedula,))
        return Response({'message': 'User updated successfully'})
    except Error as e:
        logger.error(f'Error: {e}')
        return Response({'message': f'Error: interno'}, status=500)
