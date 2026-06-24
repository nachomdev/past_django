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
    path('frances', views.frances, name='frances'),
    path('chino', views.chino, name='chino'),
    path('flexiones', views.flexiones, name='flexiones'),
    path('flexiones/api/data', views.flexiones_data, name='flexiones_data'),
    path('flexiones/api/add', views.flexiones_add, name='flexiones_add'),
    path('flexiones/api/goal', views.flexiones_goal, name='flexiones_goal'),
    path('flexiones/api/delete/<int:log_id>', views.flexiones_delete, name='flexiones_delete'),
    path('flexiones/login', views.flexiones_login, name='flexiones_login'),
    path('flexiones/signup', views.flexiones_signup, name='flexiones_signup'),
    path('flexiones/logout', views.flexiones_logout, name='flexiones_logout'),
]
