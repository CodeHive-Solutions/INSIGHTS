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

    def test_area_parent(self):
        """Test the parent field of the area model."""
        area = Area.objects.first()
        if not area:
            area = Area.objects.create(name="Test Area")
        parent_area = Area.objects.create(name="Parent Area")
        area.parent = parent_area
        area.save()
        self.assertIn(area, parent_area.children.all())
        self.assertEqual(len(area.children.all()), 0)

    def test_get_children(self):
        """Test the get_children method of the area model."""
        area = Area.objects.first()
        if not area:
            area = Area.objects.create(name="Test Area")
        child_area = Area.objects.create(name="Child Area", parent=area)
        self.assertIn(child_area, area.get_children())
        self.assertEqual(len(area.get_children()), 1)

    def test_get_children_managers(self):
        """Test the get_children_managers method of the area model."""
        area = Area.objects.first()
        if not area:
            area = Area.objects.create(name="Test Area")
        child_area = Area.objects.create(
            name="Child Area", parent=area, manager=self.user
        )
        self.assertIn(self.user, area.get_children_managers())
        self.assertEqual(len(area.get_children_managers()), 1)

    def test_get_parents(self):
        """Test the get_parents method of the area model."""
        area = Area.objects.first()
        if not area:
            area = Area.objects.create(name="Test Area")
        parent_area = Area.objects.create(name="Parent Area")
        area.parent = parent_area
        area.save()
        self.assertIn(parent_area, area.get_parents())
        self.assertEqual(len(area.get_parents()), 1)

    def test_get_parents_managers(self):
        """Test the get_parents_managers method of the area model."""
        area = Area.objects.first()
        if not area:
            area = Area.objects.create(name="Test Area")
        parent_area = Area.objects.create(name="Parent Area", manager=self.user)
        area.parent = parent_area
        area.save()
        self.assertIn(self.user, area.get_parents_managers())
        self.assertEqual(len(area.get_parents_managers()), 1)
