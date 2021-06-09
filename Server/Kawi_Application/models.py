from django.db import models
from django.shortcuts import render
from rest_framework import serializers
from django.utils import timezone

class Author(models.Model):
    author = models.CharField(max_length= 250, unique=True)
    class Meta:
        ordering = ('id',)
    def save(self, *args, **kwargs):
        super(Author, self).save(*args, **kwargs)
    def __str__(self):
        return '%s' % (self.author)

class Category(models.Model):
    category = models.CharField(max_length=250, unique=True)
    class Meta:
        ordering = ('id',)
    def save(self, *args, **kwargs):
        super(Category, self).save(*args, **kwargs)
    def __str__(self):
        return '%s' % (self.category)


class Books(models.Model):
    book_name = models.CharField(max_length=250)
    author = models.CharField(max_length=250, default='')
    category = models.CharField(max_length=250,)
    description = models.TextField(null=True)
    publisher = models.CharField(max_length=100)
    book_quantity = models.PositiveIntegerField(default=0)
    price = models.PositiveIntegerField(default=0)
    book_cover = models.JSONField()

    class Meta:
        ordering = ('id',)

    def save(self, *args, **kwargs):
        super(Books, self).save(*args, **kwargs)

    def __str__(self):
        return '%s' % (self.book_name)

class Customers(models.Model):
    customer_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    profile_pic = models.JSONField(null=True)
    password = models.CharField(max_length=150)

    class Meta:
        ordering = ('id',)

    def save(self, *args, **kwargs):
        super(Customers, self).save(*args, **kwargs)

    def __str__(self):
        # return self.customer_name
        return '%s' % (self.customer_name)

class Cart(models.Model):
    cart_customer = models.ForeignKey(Customers, related_name='cart_customer', on_delete=models.CASCADE, default='')
    cart_book = models.ForeignKey(Books, related_name='cart_book', on_delete=models.CASCADE, default='')
    cart_book_quantity = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ('id',)

    def save(self, *args, **kwargs):
        super(Cart, self).save(*args, **kwargs)

class Order(models.Model):
    order_customer = models.ForeignKey(Customers, related_name='customer_id', on_delete=models.CASCADE, default='')
    order_book = models.ForeignKey(Books, related_name='book_id', on_delete=models.CASCADE, default='')
    order_phone = models.CharField(max_length=11, default='')
    order_delivery_address = models.CharField(max_length=250)
    order_date = models.TextField()
    order_status = models.CharField(max_length=10, default='New')
    order_quantity = models.PositiveIntegerField(default=0)
    order_price = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ('id',)

    def save(self, *args, **kwargs):
        super(Order, self).save(*args, **kwargs)
