from django.db import models

# Create your models here.

class User(models.Model):
    crn=models.IntegerField(primary_key=True)
    name=models.CharField(max_length=100)
    email=models.EmailField(max_length=100)
    password=models.CharField(max_length=100)
    phone=models.CharField(max_length=100)
    
    
class Address(models.Model):
    crn=models.ForeignKey(User, on_delete=models.CASCADE)
    address=models.CharField(max_length=100)
    city=models.CharField(max_length=100)
    state=models.CharField(max_length=100)
    zip=models.CharField(max_length=100)
    country=models.CharField(max_length=100)