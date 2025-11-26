# pastapp/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('past', views.past, name='pasto'),
    path('juan', views.juan, name='pastojuan'),
    path('azar', views.azar, name='pastoazar'),
]
