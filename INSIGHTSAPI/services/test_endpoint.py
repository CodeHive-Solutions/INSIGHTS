from django.template.loader import render_to_string
from django.http import HttpResponse


# return the view
def test_endpoint(request):
    message = "Hello World"
    subject = "Test"
    email_content = render_to_string(
        "email_template.html", {"message": message, "title": subject}
    )
    response = HttpResponse(email_content)
    response["X-Frame-Options"] = "DENY"  # Adjust the value as needed
    return response
