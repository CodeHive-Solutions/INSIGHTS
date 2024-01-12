from hierarchy.models import Area
from services.tests import BaseTestCase
from users.models import User


# Create your tests here.
class PQRSViewTest(BaseTestCase):
    """Test for PQRS view."""

    databases = {"default", "staffnet"}

    def setUp(self):
        """Set up the test case."""
        super().setUp()
        Area.objects.create(name="Test")
        staffUser = User.objects.get(username="staffnet")
        # Update the first_name and last_name of the user
        staffUser.first_name = "HEIBERT STEVEN"
        staffUser.last_name = "MOGOLLON MAHECHA"
        staffUser.save()

    def test_get_complaints(self):
        """Test get complaints."""
        response = self.client.get("/pqrs/complaints/")
        self.assertEqual(response.status_code, 405)

    def test_get_all_complaints(self):
        """Test get all complaints."""
        response = self.client.get("/pqrs/complaints/all/")
        self.assertEqual(response.status_code, 405)

    def test_create_complaint(self):
        """Test create complaint."""
        response = self.client.post(
            "/pqrs/complaints/",
            {
                "name": "MOGOLLON MAHECHA - HEIBERT STEVEN",
                "type": "Test",
                "description": "Test1",
                "contact_info": "Test",
            },
        )
        self.assertEqual(response.status_code, 201, response.data)

    def test_create_congratulation(self):
        """Test create congratulation."""
        response = self.client.post(
            "/pqrs/congratulations/",
            {
                "name": "MOGOLLON MAHECHA - HEIBERT STEVEN",
                "type": "Test",
                "description": "Test",
                "contact_info": "Test",
            },
        )
        self.assertEqual(response.status_code, 201)

    def test_create_suggestion(self):
        """Test create suggestion."""
        response = self.client.post(
            "/pqrs/suggestions/",
            {
                "name": "MOGOLLON MAHECHA - HEIBERT STEVEN",
                "type": "Test",
                "description": "Test",
                "contact_info": "Test",
            },
        )
        self.assertEqual(response.status_code, 201)

    def test_create_other(self):
        """Test create other."""
        response = self.client.post(
            "/pqrs/others/",
            {
                "name": "MOGOLLON MAHECHA - HEIBERT STEVEN",
                "type": "Test",
                "description": "Test",
                "contact_info": "Test",
            },
        )
        self.assertEqual(response.status_code, 201)
