from django.shortcuts import render
from django.http import HttpResponse


# return the view
def test_endpoint(request):
    message = "Hello World"
    subject = "Test"
    return render(
        request, "email_template.html", {"message": message, "title": subject}
    )
    response = HttpResponse(email_content)
    response["X-Frame-Options"] = "DENY"  # Adjust the value as needed
    return response
