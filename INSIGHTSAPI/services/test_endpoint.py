import base64
from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponse


# return the view
def test_endpoint(request):
    message = "Hello World"
    subject = "Test"
    with open(str(settings.STATIC_ROOT) + "/payslip/just_logo.png", "rb") as logo:
        logo = logo.read()
        logo = base64.b64encode(logo).decode("utf-8")
    payslip = {
        "title": "Test fecha",
        "identification": "1234567890",
        "name": "Test name",
        "position": "Test position",
        "salary": 1000000,
        "total_deductions": 200000,
        "net_pay": 1000000,
        "days": 15,
        "gross_earnings": 1000000,
        "healthcare_contribution": 100000,
        "pension_contribution": 100000,
        "tax_withholding": 100000,
        "additional_deductions": 100000,
        "biweekly_period": 1000000,
        "transport_allowance": 100000,
        "bonus_paycheck": 100000,
        "apsalpen": 100000,
        "solidarity_fund_percentage": '0,015',
        "solidarity_fund": 150000,
    }
    return render(
        request,
        "payslip.html",
        {"payslip": payslip, "logo": logo},
    )
