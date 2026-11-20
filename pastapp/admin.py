from django.contrib import admin
from .models import Verb, PlayLog

admin.site.register(Verb)
admin.site.register(PlayLog)

from .models import VivirPlan, VivirSession, VivirBodyWeight, VivirExercise, VivirMeal, VivirFood
admin.site.register(VivirPlan)
admin.site.register(VivirSession)
admin.site.register(VivirBodyWeight)
admin.site.register(VivirExercise)
admin.site.register(VivirMeal)
admin.site.register(VivirFood)
