from django.test import TestCase
from django.utils import timezone
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from django.urls import reverse
from rest_framework.test import APIClient
from .models import Goals
import unittest

class GoalAPITestCase(TestCase):
    # @classmethod
    # def setUpTestData(cls):
        # cls.goal = Goal.objects.create(campaign='Base Test Goal', value='99999.99')
        # cls.goal2 = Goal.objects.create(campaign='Base Test Goal 2', value='50000.00')

    def setUp(self):
        self.client = APIClient()
    
    def test_metas_upload(self,called=False):
        if called:
            # Create a SimpleUploadedFile instance from the Excel file
            file_path = '/var/www/INSIGHTS/INSIGHTSAPI/goals/excels/Entrega de metas.xlsx'
            with open(file_path, 'rb') as file_obj:
                file_data = file_obj.read()
            excel_file = SimpleUploadedFile("Entrega de metas.xlsx", file_data, content_type="application/vnd.ms-excel")
            # Send the POST request to the upload-excel URL with the Excel file data
            response = self.client.post(reverse('goal-list'), {'file': excel_file})
            # Assert the response status code and perform additional assertions for the response data
            number_goals = Goals.objects.all().count()
            self.assertTrue(number_goals > 0)
            self.assertEqual(response.status_code, 201)

    def test_ejecucion_upload(self, called=False):
        if called:
            # Create a SimpleUploadedFile instance from the Excel file
            file_path = '/var/www/INSIGHTS/INSIGHTSAPI/goals/excels/Ejecución de metas.xlsx'
            with open(file_path, 'rb') as file_obj:
                file_data = file_obj.read()
            excel_file = SimpleUploadedFile("Ejecución de metas.xlsx", file_data, content_type="application/vnd.ms-excel")
            # Send the POST request to the upload-excel URL with the Excel file data
            response = self.client.post(reverse('goal-list'), {'file': excel_file})
            # Assert the response status code and perform additional assertions for the response data
            self.assertEqual(response.status_code, 201)
            count = Goals.objects.exclude(total='').count()
            self.assertTrue(count > 0)


    def test_borrado_accepted(self):
        # Sube registros que despues borrar
        # Create a SimpleUploadedFile instance from the Excel file
        file_path = '/var/www/INSIGHTS/INSIGHTSAPI/goals/excels/Entrega de metas.xlsx'
        with open(file_path, 'rb') as file_obj:
            file_data = file_obj.read()
        excel_file = SimpleUploadedFile("Entrega de metas.xlsx", file_data, content_type="application/vnd.ms-excel")
        # Invoke the test_metas_upload() method to have data in the database and some goals like accepted
        self.test_metas_upload(called=True)
        # See if there are goals created
        number_goals = Goals.objects.all().count()
        self.assertTrue(number_goals > 0)
        # put accepted to True and accepted_at to now() to Goals
        Goals.objects.all().update(accepted=True,accepted_at=timezone.now())
        # Send the POST request to the upload-excel URL with the Excel file data
        response = self.client.post(reverse('goal-list'), {'file': excel_file})
        self.assertEqual(response.status_code, 201)
        # See if the accepted goals were deleted
        count = Goals.objects.exclude(accepted='').count()
        count_at = Goals.objects.exclude(accepted_at=None).count()
        self.assertEqual((count, count_at), (0, 0))
        #Do the same verifications but with execution
        Goals.objects.all().update(accepted_execution=True,accepted_execution_at=timezone.now())
        self.test_ejecucion_upload(called=True)
        count_execution = Goals.objects.exclude(accepted_execution='').count()
        count_at_execution = Goals.objects.exclude(accepted_execution_at=None).count()
        self.assertEqual((count_execution, count_at_execution), (0, 0))

    def test_create_one(self):
        valid_payload = {
            'cedula':'1000065648',
            'name': 'Heibert',
            'campaign': 'Base Test Goal',
            'result': '100',
            'evaluation': '100',
            'quality': '100',
            'clean_desk': '100',
            'total': '100',
            'job_title': 'Developer',
            'last_update': timezone.now(),
            'criteria': '100',
            'quantity': '100',
        }
        # Send a POST request to the view with the valid data
        response = self.client.post('/your-api-endpoint/', valid_payload, format='json')
        # Assert that the response status code is 200 OK or as expected
        self.assertEqual(response.status_code, 200)
        # Assert that the response data or content is as expected
        self.assertEqual(response.data, "Data is valid") #type: ignore

class SendEmailTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('goal-send-email')
        self.heibert = Goals.objects.create(
            cedula='1000065648',
            name = 'Heibert',
            campaign = 'Base Test Goal',
            result = '100',
            evaluation = '100',
            quality = '100',
            clean_desk = '100',
            total = '100',
            job_title = 'Developer',
            last_update = timezone.now(),
            criteria = '100',
            quantity = '100',
        )

    def test_send_email_success(self):
        # Prepare the necessary data for the request
        payload = {
            'pdf': "JVBERi0xLjcNJeLjz9MNCjYgMCBvYmoNPDwvQXV0aG9yKEphbmluYSBLaXZpbmVuKS9DcmVhdGlvbkRhdGUoRDoyMDE5MDIxMjE3MjczMyswMCcwMCcpL0NyZWF0b3IoTWljcm9zb2Z0IFdvcmQpL01vZERhdGUoRDoyMDE5MDkyNzE1Mzg0NlopL1Byb2R1Y2VyKDMtSGVpZ2h0c1woVE1cKSBQREYgT3B0aW1pemF0aW9uIFNoZWxsIDQuOC4yNS4yIFwoaHR0cDovL3d3dy5wZGYtdG9vbHMuY29tXCkpPj4NZW5kb2JqDTcgMCBvYmoNPDwvRGlzcGxheURvY1RpdGxlIHRydWU+Pg1lbmRvYmoNOCAwIG9iag08PC9GaWx0ZXIvRmxhdGVEZWNvZGUvRmlyc3QgMjcvTGVuZ3RoIDMwNi9OIDUvVHlwZS9PYmpTdG0+Pg1zdHJlYW0KeJyFkU1Lw0AQhv/KS08KsflsqhB6UQSxaJEe/KCHNZnaxWQ33Zm09N/LNsX0IHibeRmeeZhJECFFFiNDnOaYII1zxMim1yiK8F47FqSI8BLO1W+5PLQUPndSa0M8mxVFeGs7I7iKwzti+YgjP4bw9e0d+Q2mSYRodYJlA6wvF8qRESQ9WUtNF3PrqMFDy11z+T8+nyQDfjLgJ+f49Aw/eqJtR2itcxbbTvO2Uw2IxTeobH1cr/16n6g+AmuBakgClNYwlULSuQCq0q3mUmNHtZbxeDzqnf9UTaZe9eSUnTstN+QImmEsrCHsNxa13RGjVdpAC1O9Do4xE30z1FrIwTuZCntlhCEWG7UjaAnAumnrAz6pVB37yLM9ajDsrxqHj7rik+mq/+1CffnH/gByL6RzCmVuZHN0cmVhbQ1lbmRvYmoNOSAwIG9iag08PC9MYW5nKGVuLVVTKS9NYXJrSW5mbzw8L01hcmtlZCB0cnVlPj4vT3V0bGluZXMgMiAwIFIvUGFnZXMgMSAwIFIvVHlwZS9DYXRhbG9nL1ZpZXdlclByZWZlcmVuY2VzIDcgMCBSPj4NZW5kb2JqDTEwIDAgb2JqDTw8L0NvbnRlbnRzIDIyIDAgUi9Dcm9wQm94WzAgMCA2MTIgNzkyXS9Hcm91cDw8L0NTL0RldmljZVJHQi9TL1RyYW5zcGFyZW5jeS9UeXBlL0dyb3VwPj4vTWVkaWFCb3hbMCAwIDYxMiA3OTJdL1BhcmVudCAxIDAgUi9SZXNvdXJjZXM8PC9FeHRHU3RhdGU8PC9HUzUgMTEgMCBSL0dTOCAxMiAwIFI+Pi9Gb250PDwvRjEgMTMgMCBSL0YyIDE2IDAgUi9GMyAxOSAwIFI+Pj4+L1JvdGF0ZSAwL1N0cnVjdFBhcmVudHMgMC9UYWJzL1MvVHlwZS9QYWdlPj4NZW5kb2JqDTIyIDAgb2JqDTw8L0ZpbHRlci9GbGF0ZURlY29kZS9MZW5ndGggNDY5Mz4+DXN0cmVhbQp4nK1cSW/cRha+61cQOakDiea+YIIAie0EGcQZB3Eyh8Ec2q3WkrFaMlvyZP791Pa2qiKbrWYAOWzW/uqrtxdfvU+++ebVu9c/vUmy5Ntvv3/z+uzVj7/Vyc3+LE9uztosrYs6aeoireqkavO0SJosLdo6GbZn11+fvX2nGlAfuevj81mWZvq/Pi9Ux436t+0L3eafX5/tzr7/cJap3tVInR4pS348e/VDnqhR9Ggfrs/ypky7MmnU/9rkw9XZv85/fhi296vqPPnpcb+6LM6f71f/Tj78/ezth7Nf/VkUR80iHL2qujRv+eiJN9iBnn/lsyndbNouzTQti1b1WtWNImVep2OUrF6wBtWh2i+9gq6xY5W4gq9+WTXn21V3/ln9Pa8u88r8SlaX7fmjenhQf8PwAK8+mxrP6ued+tvTz7X6uzdVdPP9k35yLaDfO+jkyvX7Sb2u7QhbbK5r6YH1bpam63vWjx5XN1pP9GXe73U/NAszvS28usD3G91ip4fThZsnWIB50MMNF6KPK7fyR1zRfoPr+rLFieDoqfznKwaYl22hwmLat3wLk/l9Bkei9kCYN2lfAwqzURQ2L0BhmfR6/n2TqgOcd3oci8DVZX3+4XZVdOfbYasIWTSKfOrXXj+3anfU80PyYArMD1fpv7e2xPz4ZJ7N4xdTZ588rtVPtRWmje3L9Puk9hqbXF/Izvbb7X9Ms32yvn7aDolq0p8/JWsa/sq10M/s9dM+eTKTqc9vqegLm7Ad/SLZ0697M63HT/8zc/y43dg5P5v1i2aCMI+2c7u0NE1fCiu3J7ViOH0tduUUULUOHXqctkjqPk+qpkvG4dS9iDGrUj33SsmdMqm7Lq2KOFdmI/VuJCbE6rbRLa0Qy4sRAZa9CPFwaNvCHK9aHbMGBBcwV8P6DLPTW1zVjsNZHlhUyAJ1UZzb6RJT1bZ8WuUN9LXGzi1XUyUXrJjYn24esMAytzyQdXaFLPgRn0zjjX3Wnd1YhqibWI7Y4cwMH6Tx360dVx9YT7qsyNXJ0dNGRqprbmXHwxrW5F7ucKSP6ulW/aWOe5vBDL0+Og7uRrlDAj26AQZaIkqCo04D4KqptLYAuEoLAP9pEGoahJClOwmdLSMkiMstLdUuU9Nsb1rqJ5BuunxnwKXl2o4aGZrtnIAfWG8kIT0guHI5LcLgjktXwr1qocBYFtPCOGXTfT8AJPaiX1f8CfUEPGVsOy/zvkWEITQZxnQ5iHIAlKHvA5Fg67AehQmgQKmPDAWLQKCukNU9um3WZ4wvB3cMKKaO8g9ARsKNLSBg0IYh67GHXqNiHWlASLIla0bi0oGEZuR4xJWb9M6vnDczKrMV/UM/DpuV4xNWCVtdVnYnhxcLRSB4qXatkQS3k0Iq2nkAtc38NEACZVpVAv6yQ2Iy6nx0q2SdbiV1iOY3jhryzKkqxLj2MSQqQbk0EqtCINFQnU4rMVG+03Xl1vLACxBzF1QNyEp4pb51jRqGoIVvnhHFnJw4Jr5MaZhfVmS+1DWJwiu7darGExgmB0AMVWNskQ34K9RhxR6/pkEnj4MVfaoyo4CbgWKlbkEgY29wCA3AGEKUCdoXi0usMkOQONrq8a/gwBIX1a9NDceM8TfQrj3/fcWtuikBaIkK5inatFQRbVqhOpGxpwnINCdTkDesgw3utYNZ3jjuo0tvfUx2QuC24nyTrY1816wFx8cWdPDvpY1uukKgIicCAaDmFuf/fheWl+NS1kRSttIQOtqCCJTo03CjrJG8s7jhhjXfpzwrnNijGvq1so1C1dYesVNlQl61aSZnh7w89ZUAY0X89rjekSGRJ69+Xu9uEmWhXv7+2+oUq0J7w7JOTOU1koGksyZInZkXj8RuQc9DUiqaIQA2jMx3nKqmwweqgZClo+Zqkt7gXsj9UwAzmFtTC8LsZ8SbLzx0vUcUrAPtNSxHN/q48txEevmk3RKLGfiJtF3zg+deMh685TR0vUVOQ9UXWm+wp6EomV/0tBORNWnu7HNiL1K1BhUWN4bOf1zsSA4pNDDzU7//y3G+LqYM0wC/rEgZJRDem7JQCLn+Sa/x7cAL7Pij6HC34mYocebQBDbjjvDxnZvEZ39CW/fCDV9lzBIlXjMMyCiR0wRr80VaejL3AW8HQ8KEtyMHjzfgslOiOCLfI2yqXI5NOfRWXZH2dspjZj/wjQ17fkZJC+4OfZojjpCUneP3BpkcyeY1YE1B4i8y/LmiqGsBIsh3IhiBU1y06Al18jUVWvlJ+iiYashkUe913VNVy5xWaM1tQJM+FT6VFRVsK4R+pWfxDjjIhlgKoliwciYoSCth/DzqrDrej1I1HQPtEny0Uj03NWkWw0PAdMCWtU8kUCznA2EDyjiiBExe0kZCW+SY/sCcDbxgzAgGPwhuki8zy5yppagjtR4HlMYqFy1TjjFGLqmG6xlf43tYHNUkphjOsOPd6tFvV8z/RJKbevvLTDRQvwBBdRMiyGeVLwmshciqO0TWH05gVMKY4EhokV+0do2cVKT7D55tElj/luoplb9lrhQMzHGhGXEhMOlJ8GPa8xXO1OzE5hl/SzarOJ8pG/bPgfE7qRjXy0mcsqn1hrPNeL9d9eJEikOCgAwNRrUQZNqDPJuMON5BsaV/uqMvdYAHBu+WSYQYbqtqac5XNUiSmGcX9THrTrO6Dxq0CsSBlwW1ILQMrlyXni8xsENPlWVFXqZ1J5ZkDVtmNOcNJ7A5Ewfd/aA5jhwyKJ5SdtGI55ER8gdxzqlIPO1RkFrrOOLAoBI7Sio0KM5M6QjXCKZeiMSySJVKSJrjMgZNVVZy70bOUpApYKqQK8UzWUBfLwsGX6awj5scCcjY0FQxAlMfZdD20SUzOG+m764aV8tfFj5H7pblZjMY8dCFSYrDbNf7YYLc2xdEb9AcNubXiP2DXgYh6tvZyk8IwiLjIFwEgEWRls51wv1InVSJ/cAhaet09lHCG3IMHL+6OprLvq0T+F/kGfCNkz2TJ3HGAvFVXRuY1M5tljRanMsQVQUxjif3Se2PMqrocuZohMFZeaFh0/Q6e4ptJ9+00C2IrMFsHO2jIESIwKxbHIHqd8n8iMR4RCqW58FAysvspM2GkqbME0bndrIjTz6DtSvifNxe8L3jh9OmTDWeLRYEQtrzN6vOcVNY64bZPNxayZvJeLOtfK0frontbe7EjEgWHhfvlHFg4HFc+wlwUvZ12nVLB1LKvkOooFbDVMkZXjKwAmhLgFuogp+AteN2QnB7IMWfdQTsaXiWmyED7W0Xd6jMnHBdOTg82IMK1rQpf9TvfO+77pmQxQRVh8DCnuxrwykUWlqcvqowD01oBcQ0X+42EeaXTwic5sWIJVAqCDQlcygvA6iu0ezMAGrGmSBrFTOAcIXEck73ceZ1m5almN2UMtVKH2fZZEQqae1Le7MDe/Nqe/nm7RIezrIp9LFHjYz4hDAQQAR6fJGC4prUkKVV5vjq7nTKNq02mfg8H+SWOjlRjiT+tEyCD9GcHlSD2AIgLgNaiHqFgomYOXTkiQDSHmWmBLECRtIBmQEb3oIahhHMKPRciWiBzFUad17xd+rnS7ycZaWYe724hVXWWdrV08H3weeg42etP8lwyXMlFsWUQj+92rVr3DXDc2nrmI1Kkp/5ooVvbSq7S+gA0nWPge+4vGFCkPSJIFNRtcQDY1Sle3m4H+RQTCCxrHXsmHzo8YmgCD//bhzmbeDHiux/TPKUDcflIpgsu7QhjTfBXB+ZumnfSxtiHsupK++2AEsDmmOT0IxCDq4Gs2feNmNBGrCA71x9rtukNLNIaKquAnMr8IiLuObJeW1KRvZ8Hw6mESYmkyjgfWrmsTwLfimEVR1uV6SWganClaS64u462ARyuIToLKrF0Vk0HJ2hPZai4+61PTwMYeolDxI21cguQg9MhZZuUlX2HTc7Yiq0qjNizQIABfrFZEDjFJmLd95SCP2WbThF2Hfpqpq+/4ktbQJSVTYim5n90FQjrJr8pwxl6pfUWxy/GEl4K5WgXRo+eQXwmTIbLRtpO4iVrGJnwbeDma32GoCjV0lODj8/cjyHfmpoZ+oJU5AZVxHPiu4NrCDyBHIPRvy2V4fh/tiYZGZS4A9S0ZDpu9GNuI6IWTbvuMc+Aoui67SGgtbWMppYVgAw5t45uGyFzSiWvEAyQF71Wh2jeXm57OBEptxAul53fChROBSiWZ6HtLbLo1I1oTapDadbpmVjIoqMZBPKcpFJw7RoG0LVWBi6OO6m7AjWirZPcztBdOok9s5CKHES/76GCFI5X3IvfCFSWfN7iutecMMkEm4yZcyj5S70uNkyBd/XVuHayNw7TIVvJYr7JDZEzNXDWIDYY2y6JaQneHxY8LOE38GJXUTyc358u1fmqR1vYBZNpa9Oo4GZLeNDKppW56D6BiZ6tJxEEhlEWSEOqv4N9WdWP+CtAhOXZWORUUmcgo+AaWfqecrVDLOZmbGuq3+ngbXD+swdb1fuBRVpfcKjzicwOkE+7B/+9Eb9J5jjloE31bMyAEL6Kvzibu2irhFB5B5lKQaBDQe7f7IAzPu0lhOg+0wRxQH8V8xlTPrPpJbqVBRQjsIkE8oD2mKNCXiB2xjjJuzWDOQdoiUwmXjovM88qM3XYkAWC950Y9cJuqnDCfjnzmQ4sDHAVRkH3CJoqwrNBhna5EVbMmDARYvWTHDNAjm9yz81p4bsQjyzrn2oxAYGk38NQ712m4UqDlYj62sycDPbFAttSVCVPR6IRu4Y5ZiEtkang4N/jySwpDnF8LgcmE0ImqJbHDRlhqAZXw7m2UBynMveucFjSp69+SIkb2SGp9BLMMMpCDPEUxHG0poo05870oLsI9Bexp0Mp9+4zHRiOyd41CykAAK53PyjSVgaMaTVP78HuzIjEEBIP2jih+jMah3cWjiSV+Qd0gvmyw0wchEfSu/mGQL7PQb8ZNCYsg5YRv0cTcwLM43nNSTA0oR0A/OQyDwt20YiuZ4RCeZBG/1+wMmZKfr6Yyl2aMpo9G5s5H2pb5tFwkJ+w3IJwzHv67Ru6SrZIRdT0fSRq6f8Xn/TcwNOmIqqKK40oVWmaviyTQOKpyXoOsS43IvxsAp+76Cqj8Vu0RdMJ2ArG08MMZXIIXzB1sUUoolcLl55jWufZHejJE9fHJvMu5yDcAmGlXdl6k7D+1tlHjEmREw4eo/bei0puynmNR29rQURhpFrNr5nW1c/wDBPzmJWtC07To/RS0V1xXzahgzsmsQs74yLf/l+PhEWk+grR7/DwoJtgdUWibtF0wnglvvolo/d6MibfnFEqr7Kw7kbeVsxX4KutYnT2n5AJHpj0nRTssCjRzG8kdqWUl7qPueLtJWz6vswf9othA7IvCwL3YbYWcqcgxOR57zvjtDWTG9kUY7d6/e8cLrRNJKQpn07qpvldZMu7t7I6x5wdQPSlBthnp/KcyzoV3NuE7iqEdcrdwm576VQphv/WArOyPc2iRhh9OsmutZRnzeZ9unFP3Ci61xF3z7ikAc/PkIDTX99hNZ98o3dPE9bjgICNzuqIynveVWly5qy7vMFZiZzv55CypLPmE3RTMe55/SCD4pt3DM/31KmQ82Bspv58ONxcj9AQAud8zkqZgdhUIupdWE2lZ7MkxTDE9+KsbWP+eJRiI6yWBodZY3omH1lTjID42KQLu0DN0zi3xyIaCOqRKaQCJzk4jsQM/eaXFAHr2vmh+5n5I3Uu+XcyEghx86k4246Ud33pF4E2j2ApMi0k3tpqVaUCJQ/JcNAMWEVPOOwoqyqa3a9eKaiOuohY07vce5Rj+XgoPoac7zCDHhCKQ5GVQJAlFqCn+wEK01+Lqexy+fwIto0nedVJK7Als4z3sucwYnnSKj6zB8ms/JkwLYM2SOPdhzevhhQs079f/EAZa4/Y+uiO9HINOQModJVZYHnCXOn4n5f7q6eLWSaKlDLZUJVaIKwDBBVJ7gxztRkcr9fi3xz0r+lk54xLv9ssvxFNeiLhL2ZLHCs6Si5qhqNkQdw6Rt7JWtB6dd3adu6A8cz3qZD8eYKCNDBgGZGEJtd+uC1KQTIKh4X7G67yVi3TLnyNNDIzSo4wXO/0Na9IO48nvvF4kx+i0cLdnAhB9PmKkUAnq5aHDxdQ+CZ5SBwYcPTo9iFdh3x4VlcmpE7vLPpf4NujmfMVLQSk13+wQ9ywdZZU4KOOtfmMBYgPMy65d9OF515qy8NcWoc/SXr/wORi+Y9CmVuZHN0cmVhbQ1lbmRvYmoNMjYgMCBvYmoNPDwvRmlsdGVyL0ZsYXRlRGVjb2RlL0ZpcnN0IDc2L0xlbmd0aCA1NjUvTiAxMS9UeXBlL09ialN0bT4+DXN0cmVhbQp4nL1UbWvbMBD+3l9xfyDoTm+WoQSSrN0GbRlNWAYlH7RUpIbELra7df9+nOwkTuqVLINxyJZ1z+me06MzESCQBKWBFFgHZEGSAkpBGQMSQacIksCmBiiB1FogB0QOgTgmTYAMkCUJl5difCvuinLj12L26zmIq9f647T2dRBLDzQcHiAmI6AjWIPwVbgu8lrMsk2o7sLP+2Lj8y/T25m4ypfFY5avxDzLR3mV7b6vs7KqJ0++BCUFB38I1bLMnuuiZJoI9+LGtwiiRExfvteceVa+hEghPmLWefZYP1VcFML9IaFRmfn14HPt19nybDbJMRt3Chv3Bzbn0pB4REPSCTQk7WiMqmXIa0jRiNGPVfSD1iQm/vlTyFZPNSTSCc7IsIEkFNdrv6q2XMbj4vVhYK2JPpCIyBGL6Lzzm7CrjxfmzZYaUTTHP8pX6wAoboLnWkEpcetfGxrSWiOmddh8Ba33ReyrF99aitLgcPggEz5dvu74xhpf8+y3Q5+1rG8iZRz8ZYkOcMZYcEo1mMRFDL/xAiN2G9eXi2PjwP2c993NpYyD/fzmPLuYdiheQ9zHYcM37om4OENbdH3aGkqiD0iZtE/bfSe9I/GAZK/I5BL7/0Q+zfgY2/nFezg+djwQseXRxv+FdB25XEodubArl01VtxVtr1zWRR9I1JYjOnK9/ROf1JRadpuS9FYvPEUv829a9BmfX2zStiVP0WprWutjteN9adum3V25tFlb/AaTgezSCmVuZHN0cmVhbQ1lbmRvYmoNMjUgMSBvYmoNPDwvRGVjb2RlUGFybXM8PC9Db2x1bW5zIDQvUHJlZGljdG9yIDEyPj4vRmlsdGVyL0ZsYXRlRGVjb2RlL0lEWyhkeklcMDE2XDIxMVwzMjVzXDI1NlwwMDJMXDI2NlwwMzE6N1wyMDZcMzQ0KSAoZHpJXDAxNlwyMTFcMzI1c1wyNTZcMDAyTFwyNjZcMDMxOjdcMjA2XDM0NCldL0luZm8gNiAwIFIvTGVuZ3RoIDg1L1Jvb3QgOSAwIFIvU2l6ZSAyNy9UeXBlL1hSZWYvV1sxIDIgMV0+Pg1zdHJlYW0KeJxVzLENgDAQQ9F/ViToaWAEdmIEFmAKBmQJSkAJh66JQvNkS5YFIxJnEpADa3D6IjgQNgd7sCErL/9xV9MdpFrbU0/DI89H1Mtl02KirP4BCc8UFgplbmRzdHJlYW0NZW5kb2JqDXN0YXJ0eHJlZg02NDkyDSUlRU9GCg==",
            'cedula': '1000065648',  # Provide an existing cedula value from your database
            'delivery_type': 'Testing'
        }

        # Send a POST request to the view
        response = self.client.post(self.url, data=payload)
        data = response.json()
        # Assert the response status code and content
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('email', data)

        # Assert that the email was sent successfully by checking the database or email logs

    def test_send_email_missing_data(self):
        # Prepare the request with missing data
        payload = {
            'pdf': 'base64_encoded_pdf_data',
            # Missing 'cedula' and 'delivery_type'
        }
        # Send a POST request to the view
        response = self.client.post(self.url, data=payload)
        # Assert the response status code and content
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = response.json()
        self.assertIn('Error', data)
        # Assert that the email was not sent and handle the specific error case

    def test_send_email_invalid_cedula(self):
        # Prepare the request with an invalid cedula value
        payload = {
            'pdf': 'base64_encoded_pdf_data',
            'cedula': '999999999999',  # Provide a non-existing cedula value
            'delivery_type': 'Some Delivery Type'
        }
        # Send a POST request to the view
        response = self.client.post(self.url, data=payload)
        # Assert the response status code and content
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)