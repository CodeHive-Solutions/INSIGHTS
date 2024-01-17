"""Logging Middleware for the Insights API"""
import logging

logger = logging.getLogger("requests")


class LoggingMiddleware:
    """Logging Middleware for the Insights API"""

    def __init__(self, get_response):
        self.get_response = get_response

    def mask_sensitive_data(self, data):
        mutable_data = data.copy()
        if "password" in mutable_data:
            mutable_data["password"] = "********"
        return mutable_data

    def log_request_info(self, request, response, log_info):
        """Log the request info"""
        if response.status_code > 500:
            log_info["Response Content"] = response.data

        if response.status_code > 500:
            logger.error(
                "{}".format(
                    ", ".join([f"{key}: {value}" for key, value in log_info.items()])
                )
            )
        else:
            logger.info(
                "{}".format(
                    ", ".join([f"{key}: {value}" for key, value in log_info.items()])
                )
            )

    def __call__(self, request):
        response = self.get_response(request)
        request_file = request.FILES.get("file", None)

        log_info = {
            "Request": request,
            "Response": response,
            "User": request.user,
        }

        if request_file:
            log_info["File"] = request_file.name

        request_data_mapping = {
            "POST": request.POST,
            "PATCH": getattr(request, "data", None),
            "PUT": getattr(request, "data", None),
            "DELETE": getattr(request, "data", None),
        }

        request_method = request.method
        if (
            request_method in request_data_mapping
            and request_data_mapping[request_method]
            and response.status_code > 500
        ):
            request_data = self.mask_sensitive_data(
                request_data_mapping[request_method]
            )
            log_info["Request Data"] = request_data

        self.log_request_info(request, response, log_info)

        return response
