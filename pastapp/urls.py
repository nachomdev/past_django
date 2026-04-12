# pastapp/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('past', views.past, name='pasto'),
    path('save_attempt', views.save_attempt, name='save_attempt'),
    path('geografia', views.geografia, name='geografia'),
]
