from rest_framework import serializers
from Kawi_Application.models import Author, Category, Books, Customers, Cart, Order

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('id', 'author')

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'category')

class BooksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Books
        fields = ('id', 'book_name', 'author', 'category', 'description', 'publisher', 'book_quantity', 'price', 'book_cover')

class CustomersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customers
        fields = ('id', 'customer_name', 'email', 'profile_pic', 'password')

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ('id', 'cart_customer','cart_book', 'cart_book_quantity')

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('id', 'order_customer', 'order_book', 'order_phone', 'order_delivery_address', 'order_date',
        'order_status', 'order_quantity', 'order_price')
