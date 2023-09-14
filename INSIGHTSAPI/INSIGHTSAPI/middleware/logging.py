import logging

logger = logging.getLogger('requests')

class LoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        cedula = request.GET.get('cedula', "user not found")
        if hasattr(request, 'data'):
            logger.info(f"User: {cedula} Request: {request}, Request Data: {request.data}")
        else:
            logger.info(f"User: {cedula} Request: {request}")
        if hasattr(response, 'data'):
            response_data = response.data
            route = getattr(request.resolver_match, 'route', None)
            if route != "goals/$" or any(keyword in response_data for keyword in ['Error', 'message']):
                logger.info("Response: %s, Response Content: %s", response, response_data)
            else:
                logger.info("Response: %s", response)
        else:
            logger.info("Response: %s", response)
        return response