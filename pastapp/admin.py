from django.contrib import admin
from .models import Verb, PlayLog

admin.site.register(Verb)
admin.site.register(PlayLog)

from .models import VivirPlan, VivirSession, VivirWeightLog
admin.site.register(VivirPlan)
admin.site.register(VivirSession)
admin.site.register(VivirWeightLog)
