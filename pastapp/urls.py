# pastapp/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('past', views.past, name='pasto'),
    path('pastold', views.index_past, name='past'),
    path('pastest', views.pastest, name='pastest'),
]
