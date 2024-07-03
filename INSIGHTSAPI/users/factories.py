import factory
import faker
from factory.django import DjangoModelFactory
from .models import User



fake_data = faker.Faker()

class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    factory.Faker._DEFAULT_LOCALE = "es_ES"
    cedula = factory.Faker("random_int", min=1000000000, max=9999999999)
    first_name = factory.LazyFunction(lambda: "Fake " + fake_data.first_name())
    last_name = factory.Faker("last_name")
    username = factory.LazyAttribute(lambda o: f"{o.first_name}_{o.last_name}")
    email = factory.Faker("email")
    is_staff = False
    is_superuser = False

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        # Directly create an instance without calling save() to avoid call StaffNet
        obj = model_class(*args, **kwargs)
        obj.save_factory()
        return obj
