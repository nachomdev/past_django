import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Verb, PlayLog, PushUpLog, PushUpGoal

def get_verbs_json():
    try:
        verbs = list(Verb.objects.values('group', 'infinitive', 'past_tense', 'spanish'))
    except Exception as e:
        print("Database error loading verbs:", e)
        verbs = []

    if not verbs:
        # Fallback if the database is empty or unmigrated on the server
        return json.dumps([
            {"group": "1", "infinitivo": "BE", "pasado": "WAS", "espa": "SER"},
            {"group": "1", "infinitivo": "DO", "pasado": "DID", "espa": "HACER"},
            {"group": "1", "infinitivo": "HAVE", "pasado": "HAD", "espa": "TENER"},
            {"group": "2", "infinitivo": "GO", "pasado": "WENT", "espa": "IR"},
            {"group": "2", "infinitivo": "SEE", "pasado": "SAW", "espa": "VER"},
            {"group": "2", "infinitivo": "MAKE", "pasado": "MADE", "espa": "HACER"},
            {"group": "ED", "infinitivo": "PLAY", "pasado": "PLAYED", "espa": "JUGAR"},
            {"group": "ED", "infinitivo": "WORK", "pasado": "WORKED", "espa": "TRABAJAR"},
            {"group": "ED", "infinitivo": "WANT", "pasado": "WANTED", "espa": "QUERER"},
            {"group": "ED", "infinitivo": "LOOK", "pasado": "LOOKED", "espa": "MIRAR"}
        ])

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

def frances(request):
    return render(request, 'pastapp/frances.html', {})

DICTATIONS = [
    {
        "id": 1,
        "title": "Dictation 1 (March 19th)",
        "text": "Carolina has a new purple bag. Inside, there is a green notebook and a red pencil-case. It has a silver sharpener and a pot of glue. She also has a small snack for break. Carolina is ready for school!",
        "hard_words": ["purple", "notebook", "sharpener", "snack"]
    },
    {
        "id": 2,
        "title": "Dictation 2 (March 26th)",
        "text": "Little Witch was a kind witch, but her mother wanted her to be mean. She decided to go to school to make friends because she was bored. Her new friends loved her and she was very helpful to them!",
        "hard_words": ["witch", "decided", "friends", "helpful"]
    },
    {
        "id": 3,
        "title": "Dictation 3 (April 9th)",
        "text": "A woman baked the most scrumptious cakes. People travelled from far away to buy them, and even the fairies wanted them. But she never left her cakes outside, so the fairies made a plan to steal the cake-maker.",
        "hard_words": ["scrumptious", "travelled", "fairies", "outside"]
    },
    {
        "id": 4,
        "title": "Dictation 4 (April 16th)",
        "text": "One warm summer night, the woman walked home through the woods. She heard many little whispers and felt fairy wings around her. She was very tired and lay down to rest. When she opened her eyes, she was in the fairies’ palace.",
        "hard_words": ["through", "whispers", "around", "palace"]
    },
    {
        "id": 5,
        "title": "Dictation 5 (April 23rd)",
        "text": "Her name is Rose. She is twenty years old. She lives with her three fairy sisters. She has got wavy gray hair and round blue eyes. Her nose is straight and her mouth is small. She is wearing a white dress and pink shoes. She likes eating cakes.",
        "hard_words": ["twenty","years","lives","fairy","wavy","gray","hair","blue","eyes","straight","mouth","small","wearing","white","dress","pink","shoes","likes","eating","cakes"]
    },
    {
        "id": 6,
        "title": "Dictation 6 (May 21st)",
        "text": "His name is Charlie. He is a young boy. He lives with his mum, dad, and four grandparents in a small, old house near the chocolate factory. He has got short blonde hair and big brown eyes. He is wearing a yellow jacket and blue trousers. He likes chocolate.",
        "hard_words": ["young","grandparents","small","house","near","blonde","hair","brown","eyes","wearing","yellow","jacket","trousers"]
    },
    {
        "id": 7,
        "title": "Dictation 7 (Jun 11th)",
        "text": "Dorothy lived on a farm in Kansas with her aunt, her uncle and her little dog, Toto. One day, a storm came and carried her house away. It landed in the country of Oz. Dorothy met the Good Witch. She thanked Dorothy for killing the Horrible Witch.",
        "hard_words": ["Dorothy","farm","Kansas","aunt","uncle","little","Toto","storm","carried","house","away","landed","Oz", "Witch", "thanked", "killing", "Horrible"]
    },
    {
        "id": 8,
        "title": "Dictation 8 (Jun 18th)",
        "text": "Dorothy is walking along the yellow brick road. She is talking to the scarecrow, the tin man and the lion. They all want to see the Wizard of Oz. Dorothy wants to go back home. After walking for a long time, they arrived at Emerald City. It was all green.",
        "hard_words": ["Dorothy","walking","yellow","brick","talking","scarecrow","tin","lion","Wizard","Dorothy","arrived","Emerald","City", "green"]
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

def chino(request):
    return render(request, 'pastapp/chino.html', {})

def flexiones(request):
    return render(request, 'pastapp/flexiones.html', {})

def flexiones_data(request):
    local_date_str = request.GET.get('date')
    if not local_date_str:
        today_date = timezone.localdate()
    else:
        try:
            today_date = datetime.strptime(local_date_str, '%Y-%m-%d').date()
        except ValueError:
            today_date = timezone.localdate()

    goal, created = PushUpGoal.objects.get_or_create(id=1)

    today_logs = PushUpLog.objects.filter(date=today_date).order_by('-timestamp')
    today_total = sum(log.amount for log in today_logs)

    week_start = today_date - timedelta(days=today_date.weekday())
    week_end = week_start + timedelta(days=6)
    weekly_logs = PushUpLog.objects.filter(date__range=[week_start, week_end])
    weekly_total = sum(log.amount for log in weekly_logs)

    monthly_logs = PushUpLog.objects.filter(date__year=today_date.year, date__month=today_date.month)
    monthly_total = sum(log.amount for log in monthly_logs)

    recent_sets = []
    for log in today_logs:
        local_time = timezone.localtime(log.timestamp)
        recent_sets.append({
            'id': log.id,
            'amount': log.amount,
            'time': local_time.strftime('%H:%M')
        })

    if today_date.month == 12:
        next_month = today_date.replace(year=today_date.year + 1, month=1, day=1)
    else:
        next_month = today_date.replace(month=today_date.month + 1, day=1)
    last_day = (next_month - timedelta(days=1)).day

    daily_sums = {d: 0 for d in range(1, last_day + 1)}
    for log in monthly_logs:
        daily_sums[log.date.day] += log.amount

    chart_days_labels = [f"{d}" for d in range(1, last_day + 1)]
    chart_days_data = [daily_sums[d] for d in range(1, last_day + 1)]

    yearly_logs = PushUpLog.objects.filter(date__year=today_date.year)
    monthly_sums = {m: 0 for m in range(1, 13)}
    for log in yearly_logs:
        monthly_sums[log.date.month] += log.amount

    month_names_es = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    chart_months_labels = month_names_es
    chart_months_data = [monthly_sums[m] for m in range(1, 13)]

    data = {
        'today_total': today_total,
        'weekly_total': weekly_total,
        'monthly_total': monthly_total,
        'goals': {
            'daily': goal.daily,
            'weekly': goal.weekly,
            'monthly': goal.monthly,
        },
        'recent_sets': recent_sets,
        'chart_daily': {
            'labels': chart_days_labels,
            'data': chart_days_data,
            'month_name': today_date.strftime('%B')
        },
        'chart_monthly': {
            'labels': chart_months_labels,
            'data': chart_months_data,
            'year': today_date.year
        }
    }
    return JsonResponse(data)

@csrf_exempt
def flexiones_add(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            amount = int(data.get('amount', 0))
            if amount <= 0:
                return JsonResponse({'error': 'La cantidad debe ser mayor a 0'}, status=400)
            
            local_date_str = data.get('date')
            if local_date_str:
                date_val = datetime.strptime(local_date_str, '%Y-%m-%d').date()
            else:
                date_val = timezone.localdate()

            log = PushUpLog.objects.create(
                amount=amount,
                date=date_val
            )
            return JsonResponse({'status': 'ok', 'id': log.id, 'amount': log.amount})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def flexiones_goal(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            goal, created = PushUpGoal.objects.get_or_create(id=1)
            if 'daily' in data:
                goal.daily = int(data['daily'])
            if 'weekly' in data:
                goal.weekly = int(data['weekly'])
            if 'monthly' in data:
                goal.monthly = int(data['monthly'])
            goal.save()
            return JsonResponse({'status': 'ok'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def flexiones_delete(request, log_id):
    if request.method == 'POST' or request.method == 'DELETE':
        try:
            log = PushUpLog.objects.get(id=log_id)
            log.delete()
            return JsonResponse({'status': 'ok'})
        except PushUpLog.DoesNotExist:
            return JsonResponse({'error': 'Log no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

