# pastapp/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('past', views.past, name='pasto'),
    path('save_attempt', views.save_attempt, name='save_attempt'),
    path('geografia', views.geografia, name='geografia'),
    path('dictation', views.dictation_list, name='dictation_list'),
    path('dictation/<int:dictation_id>', views.dictation_play, name='dictation_play'),
    path('dictation/<int:dictation_id>/practice', views.dictation_practice, name='dictation_practice'),
]
