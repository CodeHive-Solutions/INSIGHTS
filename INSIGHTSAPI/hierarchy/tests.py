from services.tests import BaseTestCase
from hierarchy.models import Area
from users.models import User


# Create your tests here.
class AreaTest(BaseTestCase):

    def test_manager_assignment(self):
        """Test the manager assignment for the area model."""
        area = Area.objects.first()
        if not area:
            area = Area.objects.create(name="Test Area")
        self.assertEqual(area.manager, self.user)
        demo_user = self.create_demo_user()
        self.assertEqual(demo_user.area.manager, None)

    def test_no_manager_assignment(self):
        """Test that if the user is not a manager, the manager field is None."""
        area = Area.objects.first()
        if not area:
            area = Area.objects.create(name="Test Area")
        demo_user = self.create_demo_user()
        self.assertEqual(demo_user.area.manager, None)
