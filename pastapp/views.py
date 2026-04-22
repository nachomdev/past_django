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
    import os
    from django.conf import settings
    
    ar_path = os.path.join(settings.BASE_DIR, 'pastapp', 'static', 'pastapp', 'maps', 'ar-all.topo.json')
    fk_path = os.path.join(settings.BASE_DIR, 'pastapp', 'static', 'pastapp', 'maps', 'fk-all.topo.json')
    
    with open(ar_path, 'r', encoding='utf-8') as f:
        ar_json = f.read()
    with open(fk_path, 'r', encoding='utf-8') as f:
        fk_json = f.read()
        
    return render(request, 'pastapp/geografia.html', {
        'ar_json': ar_json,
        'fk_json': fk_json,
    })

DICTATIONS = [
    {
        "id": 1,
        "title": "Dictation 1",
        "text": "Carolina has a new purple bag. Inside, there is a green notebook and a red pencil-case. It has a silver sharpener and a pot of glue. She also has a small snack for break. Carolina is ready for school!",
        "hard_words": ["purple", "notebook", "sharpener", "snack"]
    },
    {
        "id": 2,
        "title": "Dictation 2",
        "text": "Little Witch was a kind witch, but her mother wanted her to be mean. She decided to go to school to make friends because she was bored. Her new friends loved her and she was very helpful to them!",
        "hard_words": ["witch", "decided", "friends", "helpful"]
    },
    {
        "id": 3,
        "title": "Dictation 3",
        "text": "A woman baked the most scrumptious cakes. People travelled from far away to buy them, and even the fairies wanted them. But she never left her cakes outside, so the fairies made a plan to steal the cake-maker.",
        "hard_words": ["scrumptious", "travelled", "fairies", "outside"]
    },
    {
        "id": 4,
        "title": "Dictation 4",
        "text": "One warm summer night, the woman walked home through the woods. She heard many little whispers and felt fairy wings around her. She was very tired and lay down to rest. When she opened her eyes, she was in the fairies’ palace.",
        "hard_words": ["through", "whispers", "around", "palace"]
    },
    {
        "id": 5,
        "title": "Dictation 5",
        "text": "Her name is Rose. She is twenty years old. She lives with her three fairy sisters. She has got wavy gray hair and round blue eyes. Her nose is straight and her mouth is small. She is wearing a white dress and pink shoes. She likes eating cakes.",
        "hard_words": ["twenty","years","lives","fairy","wavy","gray","hair","blue","eyes","straight","mouth","small","wearing","white","dress","pink","shoes","likes","eating","cakes"]
    }
]

def dictation_list(request):
    return render(request, 'pastapp/dictation_list.html', {
        'dictations': DICTATIONS
    })

def dictation_play(request, dictation_id):
    dictation = next((d for d in DICTATIONS if d["id"] == dictation_id), None)
    if not dictation:
        from django.http import Http404
        raise Http404("Dictation not found")
        
    return render(request, 'pastapp/dictation_play.html', {
        'dictation': dictation
    })

def dictation_practice(request, dictation_id):
    dictation = next((d for d in DICTATIONS if d["id"] == dictation_id), None)
    if not dictation:
        from django.http import Http404
        raise Http404("Dictation not found")
        
    return render(request, 'pastapp/dictation_practice.html', {
        'dictation': dictation,
        'hard_words': dictation.get('hard_words', [])
    })

