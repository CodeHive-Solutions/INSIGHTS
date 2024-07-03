import factory
from notifications.models import Notification
from users.factories import UserFactory
from users.models import User

class NotificationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Notification

    if User.objects.filter(cedula=1001185389).exists():
        user = User.objects.get(cedula=1001185389)
    else:
        user = factory.SubFactory(UserFactory)
    title = factory.Faker("sentence")
    message = factory.Faker("sentence")
    read = factory.Faker("boolean")
    created_at = factory.Faker("date_time_this_month")
