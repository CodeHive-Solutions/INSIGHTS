"""Logging Middleware for the Insights API"""
import logging

logger = logging.getLogger("requests")


class LoggingMiddleware:
    """Logging Middleware for the Insights API"""

    def __init__(self, get_response):
        self.get_response = get_response

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

        if hasattr(request, "data"):
            log_info["Request Data"] = request.data

        if hasattr(response, "data") and response.data is not None:
            data = response.data
            route = getattr(request.resolver_match, "route", None)
            no_log_routes = {"goals/", "/token/obtain", "token/refresh"}
            if (
                (route not in no_log_routes)
                and "refresh" not in data
                or "access" not in data
            ):
                log_info["Response Content"] = data

        logger.info(
            "{}".format(
                ", ".join([f"{key}: {value}" for key, value in log_info.items()])
            )
        )

        return response
