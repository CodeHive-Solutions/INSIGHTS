import logging

logger = logging.getLogger('requests')

class LoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        logger.info("Request: %s", request)
        response = self.get_response(request)
        if hasattr(response, 'data') and response.data:
            logger.info("Response Content: %s", response.data)
        else:
            logger.info("Response: %s", response)

        return response
