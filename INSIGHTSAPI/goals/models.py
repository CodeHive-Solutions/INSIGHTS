from django.db import models

class Goal(models.Model):
    campaign = models.CharField(max_length=100)
    value = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.campaign
    
    # Nick for the db
    # class Meta:
    #     db_table = "nick_name_for_db"

class Person(models.Model):
    cedula = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=100)
    campaign = models.CharField(max_length=100)
    result = models.FloatField()
    evaluation = models.FloatField()
    quality = models.FloatField()
    cleand_desk = models.FloatField()
    total = models.FloatField()

    def __str__(self):
        return self.name