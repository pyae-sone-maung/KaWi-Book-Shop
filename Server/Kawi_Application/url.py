from django.contrib import admin
from django.urls import path
from Kawi_Application import views

from django.conf.urls import include, url
from rest_framework.routers import DefaultRouter
from rest_framework.documentation import include_docs_urls

router = DefaultRouter()
router.register(r'author', views.AuthorViewSet)
router.register(r'category', views.CategoryViewSet)
router.register(r'books', views.BooksViewSet)
router.register(r'customers', views.CustomersViewSet)
router.register(r'cart', views.CartViewSet)
router.register(r'order', views.OrderViewSet)

docs_view = include_docs_urls(title="Pastebin", description="A Web API for creating and viewing highlighted code App.")

urlpatterns = [
    path('admin', admin.site.urls),
    url(r'^', include(router.urls)),
    url(r'^api/', docs_view),
]
