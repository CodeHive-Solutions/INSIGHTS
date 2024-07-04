import factory
from vacation.models import VacationRequest


class VacationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = VacationRequest

    user = factory.SubFactory("users.factories.UserFactory")
    start_date = factory.Faker("date")
    end_date = factory.Faker("date")
    request_file = factory.django.FileField(filename="test.pdf")
    uploaded_by = factory.SubFactory("users.factories.UserFactory")
    manager_approbation = factory.Faker("boolean")
    hr_approbation = factory.Faker("boolean")
    payroll_approbation = factory.Faker("boolean")
    status = factory.Faker("random_element", elements=["PENDIENTE", "APROBADA", "RECHAZADA", "CANCELADA"])
    comment = factory.Faker("text")
    uploaded_at = factory.Faker("date_time_this_month")
    manager_approved_at = factory.Faker("date_time_this_month")
    hr_approved_at = factory.Faker("date_time_this_month")
    payroll_approved_at = factory.Faker("date_time_this_month")