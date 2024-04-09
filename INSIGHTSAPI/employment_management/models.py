from django.db import models


# Create your models here.
class EmploymentCertification(models.Model):
    """Employment certification model."""

    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="employment_certifications",
        verbose_name="Usuario",
    )
    start_date = models.DateField(verbose_name="Fecha de inicio")
    # end_date = models.DateField(
    #     verbose_name="Fecha de finalización", null=True, blank=True
    # )
    position = models.CharField(max_length=100, verbose_name="Cargo")
    salary = models.DecimalField(
        max_digits=10, decimal_places=2, verbose_name="Salario"
    )
    bonuses = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, verbose_name="Bonificaciones"
    )
    contract_type = models.CharField(max_length=100, verbose_name="Tipo de contrato")
    expedition_city = models.CharField(
        max_length=100, verbose_name="Ciudad de expedición"
    )
    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name="Fecha de creación"
    )

    def __str__(self):
        return f"Certificación laboral de {self.user.get_full_name_reversed()}"

    # Disable the defaults django permissions
    class Meta:
        default_permissions = ()
        permissions = [
            ("get_employment_certification", "Can get employment certification"),
        ]
