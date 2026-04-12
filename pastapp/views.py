import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Verb, PlayLog

def get_verbs_json():
    verbs = list(Verb.objects.values('group', 'infinitive', 'past_tense', 'spanish'))
    formatted_verbs = [
        {
            "group": v["group"],
            "infinitivo": v["infinitive"],
            "pasado": v["past_tense"],
            "espa": v["spanish"]
        }
        for v in verbs
    ]
    return json.dumps(formatted_verbs)

def index(request):
    return render(request, 'pastapp/index.html', {})

def past(request):
    return render(request, 'pastapp/pasto.html', {'verbos_json': get_verbs_json()})

def index_past(request):
    return render(request, 'pastapp/past.html', {})

def pastest(request):
    return render(request, 'pastapp/pastest.html', {})
    
def juan(request):
    return render(request, 'pastapp/pastojuan.html', {'verbos_json': get_verbs_json()})
    
def azar(request):
    return render(request, 'pastapp/pastoazar.html', {'verbos_json': get_verbs_json()})

@csrf_exempt
def save_attempt(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            PlayLog.objects.create(
                player_name=data.get('player_name', 'Unknown'),
                target_verb=data.get('target_verb', ''),
                attempt_word=data.get('attempt_word', ''),
                is_correct=data.get('is_correct', False)
            )
            return JsonResponse({"status": "ok"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request"}, status=400)

def geografia(request):
    return render(request, 'pastapp/geografia.html', {})