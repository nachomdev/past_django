import json
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Verb, PlayLog, PushUpLog, PushUpGoal, VivirPlan, VivirSession, VivirBodyWeight, VivirExercise, VivirMeal, VivirFood
from decimal import Decimal, InvalidOperation
from django.utils.http import url_has_allowed_host_and_scheme
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

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

def english(request):
    return render(request, 'pastapp/english_index.html', {})

def english_practice(request):
    return render(request, 'pastapp/english.html', {})

ENGLISH_TOPICS = {
    'plurals': 'Plurals',
    'comparatives': 'Comparatives',
}

def english_topic(request, topic):
    if topic not in ENGLISH_TOPICS:
        from django.http import Http404
        raise Http404("Topic not found")

    return render(request, 'pastapp/english.html', {
        'topic': topic,
        'topic_title': ENGLISH_TOPICS[topic],
    })

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
    },
    {
        "id": 9,
        "title": "Dictation 9 (Aug 13th)",
        "text": "My winter holidays were great! First, I went to the countryside with my family. Then, we watched a fun show at the theatre. After that, I enjoyed at the cinema and I played with my friends in the park. Finally, I rested at home. It was fantastic!",
        "hard_words": ["holidays","countryside","watched","theatre","enjoyed","Finally","rested","fantastic"]
    },
    {
        "id": 10,
        "title": "Dictation 10 (Aug 20th)",
        "text": "When hungry Brown Bear woke up after winter, he could not smell food. He met an old wolf named Wilbur, who was too weak. The two animals decided to help each other: Wilbur smelt the food and Bear caught it. By working as a team, they became friends.",
        "hard_words": ["hungry","smell","wolf","Wilbur","dediced","smelt","caught","working"]
    },
    {
        "id": 11,
        "title": "Dictation 11 (Sep 3rd)",
        "text": "Last week, we started reading \"Gulliver's Travels\". Gulliver was a very clever young man, who loved adventures. His ship hit a rock and broke in two. He was scared and swam for his life. He arrived on an island and was all alone. He was very tired, so he fell asleep.",
        "hard_words": ["started","reading","Gulliver's","Travels","clever","adventures","swam","asleep"]
    },
    {
        "id": 12,
        "title": "Dictation 12 (Sep 10th)",
        "text": "One morning, Gulliver woke up and felt surprised. He tried to move, but he could not. Then, he looked around and saw many tiny people. They were afraid of Gulliver. He was confused because he didn't know where he was. Gulliver wanted to talk to them and understand what happened.",
        "hard_words": ["morning","Gulliver","surprised","tried","afraid","confused","understand","happedned"]
    },
    {
        "id": 13,
        "title": "Dictation 13 (Sep 17th)",
        "text": "The tiny people attacked Gulliver with many small arrows. They hurt him, but he stayed calm. He set himself free. He wanted to speak to the little people, but he did not understand their language. Later, the Emperor met Gulliver. He ordered some food for him. Everything was tiny! The little people were happy with their new friend.",
        "hard_words": ["attacked","Gulliver","arrows","stayed","understand","Emperor","Everything","their"]
    },
    {
        "id": 14,
        "title": "Dictation 14 (Sep 24th)",
        "text": "Gulliver stayed in Lilliput for many days. The tiny people prepared beds for him to sleep. He ate their food, learnt about their lives, shared time, and helped them, too. They had many strange and funny adventures together.",
        "hard_words": ["Lillipu","Gulliver","perpared","their","learnt","lives","shared","helped","funny","adventures"]
    },
    {
        "id": 15,
        "title": "Dictation 15 (Oct 8th)",
        "text": "Gulliver learnt that Lilliput was at war with the people of Blefuscu. He had a secret plan to help his friends. He took some hooks and ropes and swam to the other island. He put on his glasses to protect his eyes. Then, he used the ropes to pull the ships back to the port. The war was over! Everyone was happy!",
        "hard_words": ["learnt","Gulliver","Lilliput","Befuscu","swan","island","glasses","ropes","ships","Everyone"]
    },
    {
        "id": 16,
        "title": "Dictation 16 (Oct 15th)",
        "text": "Some people in Lilliput were not very happy with Gulliver. The Emperor gave Gulliver everything he wanted. Flimnap, the Emperor's friend, felt jealous of Gulliver. They said that Flimnap wanted to hurt him. Gulliver was afraid. He decided to go back home. He told the Emperor and the Empress how he felt. They agreed and helped him build a ship.",
        "hard_words": ["people","Gulliver","Lilliput","Emperor","everything","Flimnap","Emperor","jealous","decided","Empress"]
    },
    {
        "id": 17,
        "title": "Dictation 17 (Oct 29th)",
        "text": "Last Monday, our class went on an exciting campout in San Pedro. We travelled by bus with our teachers and friends. When we arrived at the campsite, we worked together in teams. In the afternoon, we played fun games. At night, we met around the campfire, ate delicious food and told stories. Sharing with my classmates was the best part of the trip!",
        "hard_words": ["class","exciting","campout","travelled","teachers","campsite","campfire","classmates"]
    },
    {
        "id": 18,
        "title": "Dictation 18 (Nov 5th)",
        "text": "It was trip day in Miss Frizzle's class and the children were really excited! Arnold's cousin, Janet, was visiting their school for the day. The children were learning about the Solar System, so they went to the planetarium to see a sky show. When they arrived, it was closed for repairs. They felt disappointed.",
        "hard_words": ["Frizzle's","children","excited","Arnold's","cousin","visiting","learning","Solar System","planetarium","arrived","repairs","disappointed"]
    },
    {
        "id": 19,
        "title": "Dictation 19 (Nov 12th)",
        "text": "As we went to the planetarium, Miss Frizzle told us about the Earth. It spins while it moves in its orbit. The spinning of the Earth makes night and day. Miss Frizzle said our first stop was the Moon. We got off the bus and looked around. There was no air, no water, no life. We wanted to play, but Ms. Frizzle said it was time to go.",
        "hard_words": ["planetarium","Frizzle","Earth","spins","orbit","spinning","night","Moon","looked around","air","water","life"]
    },
    {
        "id": 20,
        "title": "Dictation 20 (Nov 19th)",
        "text": "Her name is Miss Frizzle and she is thirty-eight years old. She has got a brother and a sister. She is tall. She has got curly ginger hair and round brown eyes. Her nose is upturned and her mouth is small. Her favourite colour is yellow and her favourite animal is the pig. She likes having adventures with her students!",
        "hard_words": ["Frizzle","thirty-eight","brother","sister","curly","ginger","round","brown","upturned","favourite","colour","yellow","adventures","students"]
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

@login_required(login_url='flexiones_login')
def flexiones(request):
    return render(request, 'pastapp/flexiones.html', {})

def flexiones_data(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'No autorizado'}, status=401)

    local_date_str = request.GET.get('date')
    if not local_date_str:
        today_date = timezone.localdate()
    else:
        try:
            today_date = datetime.strptime(local_date_str, '%Y-%m-%d').date()
        except ValueError:
            today_date = timezone.localdate()

    goal, created = PushUpGoal.objects.get_or_create(user=request.user)

    today_logs = PushUpLog.objects.filter(user=request.user, date=today_date).order_by('-timestamp')
    today_total = sum(log.amount for log in today_logs)

    week_start = today_date - timedelta(days=today_date.weekday())
    week_end = week_start + timedelta(days=6)
    weekly_logs = PushUpLog.objects.filter(user=request.user, date__range=[week_start, week_end])
    weekly_total = sum(log.amount for log in weekly_logs)

    monthly_logs = PushUpLog.objects.filter(user=request.user, date__year=today_date.year, date__month=today_date.month)
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

    yearly_logs = PushUpLog.objects.filter(user=request.user, date__year=today_date.year)
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
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'No autorizado'}, status=401)

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
                user=request.user,
                amount=amount,
                date=date_val
            )
            return JsonResponse({'status': 'ok', 'id': log.id, 'amount': log.amount})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def flexiones_goal(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'No autorizado'}, status=401)

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            goal, created = PushUpGoal.objects.get_or_create(user=request.user)
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
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'No autorizado'}, status=401)

    if request.method == 'POST' or request.method == 'DELETE':
        try:
            log = PushUpLog.objects.get(id=log_id, user=request.user)
            log.delete()
            return JsonResponse({'status': 'ok'})
        except PushUpLog.DoesNotExist:
            return JsonResponse({'error': 'Log no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

def _auth_next(request):
    """URL a la que volver después del login (?next=), validada; por defecto flexiones."""
    nxt = request.POST.get('next') or request.GET.get('next') or ''
    if nxt and url_has_allowed_host_and_scheme(nxt, allowed_hosts={request.get_host()}, require_https=request.is_secure()):
        return nxt
    return None

def _auth_brand(next_url):
    """Título del login según la app a la que vuelve."""
    if next_url and next_url.startswith('/vivir'):
        return {'brand': 'Vivir', 'brand_tagline': 'Entrenamiento, comidas y peso, día a día'}
    return {'brand': 'Flexiones', 'brand_tagline': 'Registra tu entrenamiento diario'}


def flexiones_login(request):
    next_url = _auth_next(request)
    if request.user.is_authenticated:
        return redirect(next_url or 'flexiones')
        
    error = None
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '').strip()
        if not username or not password:
            error = "Por favor complete todos los campos"
        else:
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect(next_url or 'flexiones')
            else:
                error = "Usuario o contraseña incorrectos"
                
    return render(request, 'pastapp/login.html', {'error': error, 'next': next_url or '', **_auth_brand(next_url)})

def flexiones_signup(request):
    next_url = _auth_next(request)
    if request.user.is_authenticated:
        return redirect(next_url or 'flexiones')
        
    error = None
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '').strip()
        password_confirm = request.POST.get('password_confirm', '').strip()
        
        if not username or not password or not password_confirm:
            error = "Por favor complete todos los campos"
        elif len(password) < 6:
            error = "La contraseña debe tener al menos 6 caracteres"
        elif password != password_confirm:
            error = "Las contraseñas no coinciden"
        else:
            if User.objects.filter(username=username).exists():
                error = "El nombre de usuario ya está registrado"
            else:
                try:
                    user = User.objects.create_user(username=username, password=password)
                    login(request, user)
                    return redirect(next_url or 'flexiones')
                except Exception as e:
                    error = f"Error al registrar usuario: {str(e)}"
                    
    return render(request, 'pastapp/signup.html', {'error': error, 'next': next_url or '', **_auth_brand(next_url)})

def flexiones_logout(request):
    logout(request)
    return redirect('flexiones_login')


# ---------------------------------------------------------------------------
# Vivir: rutina semanal (2 días de gym + 5 en casa), seguimiento de 4 semanas,
# comidas y registro del peso corporal.
#
# - VIVIR_EXERCISES: catálogo fijo. "met" es el esfuerzo (MET) y "minutes" la
#   duración estimada del volumen indicado. "mode": reps (series × reps, kg),
#   cardio (minutos, km, rpm) o libre (solo minutos).
# - VIVIR_FOODS: comidas sugeridas con kcal por porción; el usuario suma las suyas.
#   Base del cálculo de kcal:
#   kcal = MET × 3.5 × kg / 200 × minutos (kg = último peso registrado).
#   El usuario suma ejercicios propios (VivirExercise).
# - VIVIR_ROUTINES: rutinas elegibles. Cada ítem referencia un ejercicio del
#   catálogo; "short" es el volumen de la versión corta (semanas 1-2).
# - VIVIR_WEEK_PLAN: rutina sugerida para cada día (lunes = 0). Cada día se
#   puede cambiar por otra rutina y editar sus ítems (VivirSession.items).
# ---------------------------------------------------------------------------

VIVIR_WEEKS = 4

VIVIR_EXERCISES = [
    {'name': 'Bici', 'met': 6.0, 'minutes': 30, 'volume': '30 min', 'mode': 'cardio'},
    {'name': 'Cuádriceps (prensa o extensión)', 'met': 3.5, 'minutes': 8, 'volume': '3 × 8-12', 'mode': 'reps'},
    {'name': 'Press de pecho', 'met': 3.5, 'minutes': 8, 'volume': '3 × 8-12', 'mode': 'reps'},
    {'name': 'Jalón al pecho', 'met': 3.5, 'minutes': 8, 'volume': '3 × 8-12', 'mode': 'reps'},
    {'name': 'Bíceps', 'met': 3.5, 'minutes': 6, 'volume': '3 × 8-12', 'mode': 'reps'},
    {'name': 'Isquiotibiales', 'met': 3.5, 'minutes': 8, 'volume': '3 × 8-12', 'mode': 'reps'},
    {'name': 'Remo', 'met': 3.5, 'minutes': 8, 'volume': '3 × 8-12', 'mode': 'reps'},
    {'name': 'Caminata rápida', 'met': 4.3, 'minutes': 30, 'volume': '30 min', 'mode': 'cardio'},
    {'name': 'Core: plancha, plancha lateral, bicho muerto', 'met': 3.8, 'minutes': 10, 'volume': '10 min'},
    {'name': 'Sentadilla con disco al pecho', 'met': 5.0, 'minutes': 4, 'volume': '3 × 10-15', 'mode': 'reps'},
    {'name': 'Peso muerto rumano con disco', 'met': 5.0, 'minutes': 4, 'volume': '3 × 10-15', 'mode': 'reps'},
    {'name': 'Press de hombros con disco', 'met': 3.8, 'minutes': 4, 'volume': '3 × 10-15', 'mode': 'reps'},
    {'name': 'Remo inclinado con disco', 'met': 3.8, 'minutes': 4, 'volume': '3 × 10-15', 'mode': 'reps'},
    {'name': 'Flexiones de brazos', 'met': 3.8, 'minutes': 3, 'volume': '3 × 10-15', 'mode': 'reps'},
    {'name': 'Puente de glúteos con disco en la cadera', 'met': 3.5, 'minutes': 3, 'volume': '3 × 10-15', 'mode': 'reps'},
    {'name': 'Plancha + giros de torso con disco', 'met': 3.8, 'minutes': 3, 'volume': '30-45 s + 10-15'},
    {'name': 'Circuito: tijeras, sentadilla, escaladores, zancadas, trote en el lugar', 'met': 8.0, 'minutes': 16, 'volume': '3-4 vueltas'},
    {'name': 'Estiramientos: cadera, isquios, pecho, espalda (gato-camello, cobra, niño)', 'met': 2.3, 'minutes': 18, 'volume': '15-20 min'},
    {'name': 'Caminata larga', 'met': 3.5, 'minutes': 48, 'volume': '45-50 min', 'mode': 'cardio'},
    {'name': 'Correr', 'met': 9.8, 'minutes': 20, 'volume': '20 min', 'mode': 'cardio'},
    {'name': 'Caminata tranquila', 'met': 3.0, 'minutes': 30, 'volume': '30 min', 'mode': 'cardio'},
]

VIVIR_FOODS = [
    {'name': 'Huevo (1)', 'kcal': 75, 'protein': True},
    {'name': '2 huevos revueltos', 'kcal': 180, 'protein': True},
    {'name': 'Tostada de pan', 'kcal': 80, 'protein': False},
    {'name': 'Pan francés (1)', 'kcal': 140, 'protein': False},
    {'name': 'Medialuna', 'kcal': 150, 'protein': False},
    {'name': 'Café con leche', 'kcal': 90, 'protein': True},
    {'name': 'Mate sin azúcar', 'kcal': 5, 'protein': False},
    {'name': 'Yogur con granola', 'kcal': 220, 'protein': True},
    {'name': 'Queso (porción)', 'kcal': 110, 'protein': True},
    {'name': 'Banana', 'kcal': 100, 'protein': False},
    {'name': 'Manzana', 'kcal': 80, 'protein': False},
    {'name': 'Fruta', 'kcal': 70, 'protein': False},
    {'name': 'Ensalada mixta', 'kcal': 120, 'protein': False},
    {'name': 'Verduras al horno', 'kcal': 180, 'protein': False},
    {'name': 'Puré de papas', 'kcal': 220, 'protein': False},
    {'name': 'Arroz (plato)', 'kcal': 300, 'protein': False},
    {'name': 'Fideos con salsa (plato)', 'kcal': 450, 'protein': False},
    {'name': 'Lentejas o guiso (plato)', 'kcal': 400, 'protein': True},
    {'name': 'Pechuga de pollo a la plancha', 'kcal': 220, 'protein': True},
    {'name': 'Milanesa de carne', 'kcal': 350, 'protein': True},
    {'name': 'Milanesa de pollo', 'kcal': 300, 'protein': True},
    {'name': 'Bife de carne (200 g)', 'kcal': 400, 'protein': True},
    {'name': 'Pescado a la plancha', 'kcal': 220, 'protein': True},
    {'name': 'Hamburguesa casera', 'kcal': 450, 'protein': True},
    {'name': 'Tarta de verdura (porción)', 'kcal': 300, 'protein': True},
    {'name': 'Empanada', 'kcal': 280, 'protein': True},
    {'name': 'Pizza (2 porciones)', 'kcal': 550, 'protein': True},
    {'name': 'Sándwich de jamón y queso', 'kcal': 350, 'protein': True},
    {'name': 'Galletitas (4)', 'kcal': 160, 'protein': False},
    {'name': 'Barra de cereal', 'kcal': 100, 'protein': False},
    {'name': 'Frutos secos (puñado)', 'kcal': 180, 'protein': False},
    {'name': 'Alfajor', 'kcal': 250, 'protein': False},
    {'name': 'Gaseosa (vaso)', 'kcal': 140, 'protein': False},
    {'name': 'Cerveza (lata)', 'kcal': 150, 'protein': False},
    {'name': 'Vino (copa)', 'kcal': 125, 'protein': False},
]
VIVIR_FOOD_NAMES = {f['name'].lower() for f in VIVIR_FOODS}

VIVIR_ROUTINES = [
    {'key': 'gym_a', 'name': 'Gym A', 'kind': 'gym', 'items': [
        {'ex': 'Bici', 'notes': 'Ritmo en el que puedas hablar entrecortado'},
        {'ex': 'Cuádriceps (prensa o extensión)', 'short': '2 × 8-12', 'notes': 'Terminar con 2-3 reps en reserva'},
        {'ex': 'Press de pecho', 'short': '2 × 8-12'},
        {'ex': 'Jalón al pecho', 'short': '2 × 8-12'},
        {'ex': 'Bíceps', 'short': '2 × 8-12'},
    ]},
    {'key': 'cardio_caminata', 'name': 'Cardio casa · caminata', 'kind': 'cardio', 'items': [
        {'ex': 'Caminata rápida'},
        {'ex': 'Core: plancha, plancha lateral, bicho muerto'},
    ]},
    {'key': 'fuerza_casa', 'name': 'Fuerza casa', 'kind': 'fuerza', 'note': 'Circuito: 3 vueltas (2 en semanas 1-2)', 'items': [
        {'ex': 'Sentadilla con disco al pecho', 'short': '2 × 10-15'},
        {'ex': 'Peso muerto rumano con disco', 'short': '2 × 10-15', 'notes': 'Rodillas apenas flexionadas, espalda recta'},
        {'ex': 'Press de hombros con disco', 'short': '2 × 10-15'},
        {'ex': 'Remo inclinado con disco', 'short': '2 × 10-15'},
        {'ex': 'Flexiones de brazos', 'short': '2 × 10-15', 'notes': 'Con rodillas apoyadas si cuesta'},
        {'ex': 'Puente de glúteos con disco en la cadera', 'short': '2 × 10-15'},
        {'ex': 'Plancha + giros de torso con disco'},
    ]},
    {'key': 'gym_b', 'name': 'Gym B', 'kind': 'gym', 'items': [
        {'ex': 'Bici', 'notes': 'Opcional: 6 × (1 min fuerte + 2 min suave)'},
        {'ex': 'Isquiotibiales', 'short': '2 × 8-12'},
        {'ex': 'Remo', 'short': '2 × 8-12'},
        {'ex': 'Press de pecho', 'short': '2 × 8-12'},
        {'ex': 'Cuádriceps (prensa o extensión)', 'short': '2 × 8-12'},
    ]},
    {'key': 'cardio_circuito', 'name': 'Cardio casa · circuito', 'kind': 'cardio', 'items': [
        {'ex': 'Circuito: tijeras, sentadilla, escaladores, zancadas, trote en el lugar', 'short': '2 vueltas', 'notes': '40 s de trabajo / 20 s de descanso'},
    ]},
    {'key': 'movilidad', 'name': 'Movilidad', 'kind': 'movilidad', 'items': [
        {'ex': 'Estiramientos: cadera, isquios, pecho, espalda (gato-camello, cobra, niño)'},
    ]},
    {'key': 'caminata_larga', 'name': 'Caminata larga', 'kind': 'cardio', 'items': [
        {'ex': 'Caminata larga'},
    ]},
    {'key': 'caminata_tranquila', 'name': 'Caminata tranquila', 'kind': 'movilidad', 'items': [
        {'ex': 'Caminata tranquila'},
    ]},
]

VIVIR_WEEK_PLAN = ['gym_a', 'cardio_caminata', 'fuerza_casa', 'gym_b', 'cardio_circuito', 'fuerza_casa', 'movilidad']

VIVIR_DAY_NOTES = {
    5: 'Se repite el circuito del miércoles. Alternativa: caminata larga.',
    6: 'Alternativa: caminata tranquila.',
}

VIVIR_TIPS = [
    ('Semanas 1-2', 'versión corta (2 series / 2 vueltas) para acostumbrar el cuerpo.'),
    ('Desde la semana 3', '3 series o vueltas. Al llegar cómodo a 12-15 reps, subí el peso en el gym; en casa, hacé el movimiento más lento o sumá repeticiones.'),
    ('Intensidad', 'cada serie termina con 2-3 repeticiones en reserva.'),
    ('Comida', 'proteína en cada comida (carne, huevo, lácteos, legumbres) y suficiente agua.'),
]

VIVIR_ROUTINE_KEYS = {r['key'] for r in VIVIR_ROUTINES}
VIVIR_MEAL_TYPES = dict(VivirMeal.MEAL_TYPES)


def _parse_date(value):
    try:
        return datetime.strptime(value, '%Y-%m-%d').date()
    except (TypeError, ValueError):
        return timezone.localdate()


def _monday(d):
    return d - timedelta(days=d.weekday())


def _json_body(request):
    try:
        data = json.loads(request.body or b'{}')
    except ValueError:
        return None
    return data if isinstance(data, dict) else None


def _vivir_api(methods=('POST',)):
    """Decorador para los endpoints JSON de vivir: auth + método permitido."""
    def wrap(view):
        @csrf_exempt
        def inner(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return JsonResponse({'error': 'No autorizado'}, status=401)
            if request.method not in methods:
                return JsonResponse({'error': 'Método no permitido'}, status=405)
            return view(request, *args, **kwargs)
        inner.__name__ = view.__name__
        return inner
    return wrap


def _custom_exercise_dict(e):
    return {'id': e.id, 'name': e.name, 'met': float(e.met), 'minutes': e.minutes,
            'volume': e.volume, 'mode': e.mode, 'custom': True}


def _custom_food_dict(f):
    return {'id': f.id, 'name': f.name, 'kcal': f.kcal, 'protein': f.protein, 'custom': True}


def _num(value, cast, lo, hi):
    """Número opcional dentro de un rango; vacío = None."""
    if value in (None, ''):
        return None
    value = cast(value)
    if not lo <= value <= hi:
        raise ValueError('Valor fuera de rango')
    return value


def _session_dict(s):
    return {
        'done': bool(s and s.done),
        'minutes': s.minutes if s else 0,
        'routine': s.routine if s else '',
        'items': s.items if s else None,
        'water': s.water if s else 0,
    }


def _clean_items(raw):
    """Valida la lista de ítems editada que manda el cliente."""
    if raw is None:
        return None
    if not isinstance(raw, list) or len(raw) > 40:
        raise ValueError('Ítems inválidos')
    items = []
    for it in raw:
        if not isinstance(it, dict):
            raise ValueError('Ítems inválidos')
        name = str(it.get('name') or '').strip()[:100]
        if not name:
            raise ValueError('Ítem sin nombre')
        met = float(it.get('met') or 0)
        minutes = int(it.get('minutes') or 0)
        if not (0 <= met <= 25 and 0 <= minutes <= 600):
            raise ValueError('Esfuerzo o minutos inválidos')
        mode = it.get('mode') if it.get('mode') in ('reps', 'cardio') else 'free'
        item = {
            'name': name,
            'volume': str(it.get('volume') or '').strip()[:50],
            'notes': str(it.get('notes') or '').strip()[:255],
            'met': round(met, 1),
            'minutes': minutes,
            'mode': mode,
        }
        # Lo registrado: series/reps/kg (fuerza) o km/rpm (cardio). per_rep = minutos por repetición.
        extra = {
            'sets': _num(it.get('sets'), int, 0, 50),
            'reps': _num(it.get('reps'), int, 0, 500),
            'kg': _num(it.get('kg'), float, 0, 1000),
            'per_rep': _num(it.get('per_rep'), float, 0, 10),
            'km': _num(it.get('km'), float, 0, 500),
            'rpm': _num(it.get('rpm'), int, 0, 300),
        }
        item.update({k: (round(v, 3) if isinstance(v, float) else v) for k, v in extra.items() if v is not None})
        # Series con reps y kg distintos: [{'reps': 12, 'kg': 20}, ...]
        raw_sets = it.get('set_list')
        if raw_sets is not None:
            if not isinstance(raw_sets, list) or len(raw_sets) > 50:
                raise ValueError('Series inválidas')
            set_list = []
            for st in raw_sets:
                if not isinstance(st, dict):
                    raise ValueError('Series inválidas')
                reps = _num(st.get('reps'), int, 0, 500)
                kg = _num(st.get('kg'), float, 0, 1000)
                if reps is None and kg is None:
                    continue
                set_list.append({k: v for k, v in (('reps', reps), ('kg', round(kg, 2) if kg is not None else None)) if v is not None})
            if set_list:
                item['set_list'] = set_list
        items.append(item)
    return items


@login_required(login_url='flexiones_login')
def vivir(request):
    return render(request, 'pastapp/vivir.html', {
        'config_json': json.dumps({
            'exercises': VIVIR_EXERCISES,
            'routines': VIVIR_ROUTINES,
            'weekPlan': VIVIR_WEEK_PLAN,
            'dayNotes': VIVIR_DAY_NOTES,
            'weeks': VIVIR_WEEKS,
            'mealTypes': VivirMeal.MEAL_TYPES,
            'foods': VIVIR_FOODS,
        }, ensure_ascii=False),
        'tips': VIVIR_TIPS,
        'weeks': VIVIR_WEEKS,
        'meal_types': VivirMeal.MEAL_TYPES,
    })


@_vivir_api(methods=('GET',))
def vivir_data(request):
    """Ciclo, registro de peso corporal, ejercicios y comidas propias, últimas cargas."""
    today = _parse_date(request.GET.get('date'))
    plan, _ = VivirPlan.objects.get_or_create(user=request.user, defaults={'start_date': _monday(today)})

    body_weights = [{
        'id': w.id,
        'date': w.date.isoformat(),
        'weight_kg': float(w.weight_kg),
        'notes': w.notes,
    } for w in VivirBodyWeight.objects.filter(user=request.user).order_by('-date')[:1000]]

    # Última vez que se registró cada ejercicio (para sugerir kg/series/reps/km).
    last = {}
    sessions = VivirSession.objects.filter(user=request.user, items__isnull=False).order_by('-date')[:120]
    for sess in sessions:
        for it in sess.items or []:
            name = it.get('name')
            if name and name not in last and any(k in it for k in ('set_list', 'kg', 'sets', 'reps', 'km', 'rpm')):
                last[name] = {'date': sess.date.isoformat(),
                              **{k: it[k] for k in ('set_list', 'sets', 'reps', 'kg', 'km', 'rpm', 'minutes') if k in it}}

    return JsonResponse({
        'today': today.isoformat(),
        'start_date': plan.start_date.isoformat(),
        'profile': {'sex': plan.sex, 'birth_year': plan.birth_year, 'height_cm': plan.height_cm},
        'body_weights': body_weights,
        'custom_exercises': [_custom_exercise_dict(e) for e in VivirExercise.objects.filter(user=request.user).order_by('name')],
        'custom_foods': [_custom_food_dict(f) for f in VivirFood.objects.filter(user=request.user).order_by('name')],
        'last': last,
    })


@_vivir_api(methods=('GET',))
def vivir_week(request):
    """Resumen de la semana (lunes a domingo) que contiene la fecha: sesiones y comidas."""
    start = _monday(_parse_date(request.GET.get('date')))
    end = start + timedelta(days=6)
    sessions = {x.date: x for x in VivirSession.objects.filter(user=request.user, date__range=[start, end])}
    meals = {}
    for m in VivirMeal.objects.filter(user=request.user, date__range=[start, end]):
        agg = meals.setdefault(m.date, {'count': 0, 'kcal': 0, 'kcal_known': 0, 'protein': 0})
        agg['count'] += 1
        agg['protein'] += int(m.protein)
        if m.kcal is not None:
            agg['kcal'] += m.kcal
            agg['kcal_known'] += 1
    days = []
    for i in range(7):
        d = start + timedelta(days=i)
        days.append({'date': d.isoformat(), **_session_dict(sessions.get(d)),
                     'meals': meals.get(d, {'count': 0, 'kcal': 0, 'kcal_known': 0, 'protein': 0})})
    return JsonResponse({'start': start.isoformat(), 'end': end.isoformat(), 'days': days})


@_vivir_api(methods=('GET',))
def vivir_day(request):
    """Sesión y comidas de una fecha cualquiera (para navegar días anteriores)."""
    date_val = _parse_date(request.GET.get('date'))
    session = VivirSession.objects.filter(user=request.user, date=date_val).first()
    meals = [{
        'id': m.id,
        'meal_type': m.meal_type,
        'description': m.description,
        'kcal': m.kcal,
        'portions': float(m.portions),
        'protein': m.protein,
    } for m in VivirMeal.objects.filter(user=request.user, date=date_val).order_by('timestamp')]
    return JsonResponse({'date': date_val.isoformat(), 'session': _session_dict(session), 'meals': meals})


@_vivir_api()
def vivir_session(request):
    data = _json_body(request)
    if data is None:
        return JsonResponse({'error': 'JSON inválido'}, status=400)
    try:
        session, _ = VivirSession.objects.get_or_create(user=request.user, date=_parse_date(data.get('date')))
        if 'done' in data:
            session.done = bool(data['done'])
        if 'minutes' in data:
            minutes = int(data['minutes'] or 0)
            if not 0 <= minutes <= 1440:
                return JsonResponse({'error': 'Minutos inválidos'}, status=400)
            session.minutes = minutes
        if 'water' in data:
            session.water = max(0, min(30, int(data['water'] or 0)))
        if 'routine' in data:
            routine = data['routine'] or ''
            if routine and routine not in VIVIR_ROUTINE_KEYS:
                return JsonResponse({'error': 'Rutina inválida'}, status=400)
            if routine != session.routine:
                session.items = None  # al cambiar de rutina vuelven sus ítems
            session.routine = routine
        if 'items' in data:
            session.items = _clean_items(data['items'])
        session.save()
        return JsonResponse({'status': 'ok', 'session': _session_dict(session)})
    except (TypeError, ValueError) as e:
        return JsonResponse({'error': str(e)}, status=400)


@_vivir_api()
def vivir_start(request):
    """Arranca un ciclo nuevo de 4 semanas desde el lunes de la fecha dada."""
    data = _json_body(request)
    if data is None:
        return JsonResponse({'error': 'JSON inválido'}, status=400)
    start = _monday(_parse_date(data.get('date')))
    VivirPlan.objects.update_or_create(user=request.user, defaults={'start_date': start})
    return JsonResponse({'status': 'ok', 'start_date': start.isoformat()})


@_vivir_api()
def vivir_profile(request):
    """Sexo, año de nacimiento y altura, para calcular el gasto base diario."""
    data = _json_body(request)
    if data is None:
        return JsonResponse({'error': 'JSON inválido'}, status=400)
    sex = data.get('sex') or ''
    if sex not in ('', 'M', 'F'):
        return JsonResponse({'error': 'Sexo inválido'}, status=400)
    try:
        this_year = timezone.localdate().year
        birth_year = _num(data.get('birth_year'), int, this_year - 110, this_year - 10)
        height_cm = _num(data.get('height_cm'), int, 100, 250)
    except (TypeError, ValueError):
        return JsonResponse({'error': 'Año de nacimiento o altura inválidos'}, status=400)
    plan, _ = VivirPlan.objects.get_or_create(user=request.user, defaults={'start_date': _monday(timezone.localdate())})
    plan.sex, plan.birth_year, plan.height_cm = sex, birth_year, height_cm
    plan.save()
    return JsonResponse({'status': 'ok', 'profile': {'sex': plan.sex, 'birth_year': plan.birth_year, 'height_cm': plan.height_cm}})


@_vivir_api()
def vivir_exercise_add(request):
    data = _json_body(request)
    if data is None:
        return JsonResponse({'error': 'JSON inválido'}, status=400)
    name = str(data.get('name') or '').strip()[:100]
    if not name:
        return JsonResponse({'error': 'Falta el nombre'}, status=400)
    taken = {e['name'].lower() for e in VIVIR_EXERCISES}
    taken.update(n.lower() for n in VivirExercise.objects.filter(user=request.user).values_list('name', flat=True))
    if name.lower() in taken:
        return JsonResponse({'error': 'Ya existe un ejercicio con ese nombre'}, status=400)
    try:
        met = Decimal(str(data.get('met', '')))
        minutes = int(data.get('minutes') or 0)
    except (InvalidOperation, TypeError, ValueError):
        return JsonResponse({'error': 'Esfuerzo o minutos inválidos'}, status=400)
    if not met.is_finite() or not 1 <= met <= 25 or not 1 <= minutes <= 600:
        return JsonResponse({'error': 'Esfuerzo o minutos inválidos'}, status=400)
    mode = data.get('mode') if data.get('mode') in ('reps', 'cardio') else 'free'
    ex = VivirExercise.objects.create(
        user=request.user, name=name, met=met.quantize(Decimal('0.1')), minutes=minutes,
        volume=str(data.get('volume') or '').strip()[:50], mode=mode,
    )
    return JsonResponse({'status': 'ok', 'exercise': _custom_exercise_dict(ex)})


@_vivir_api(methods=('POST', 'DELETE'))
def vivir_exercise_delete(request, ex_id):
    deleted, _ = VivirExercise.objects.filter(id=ex_id, user=request.user).delete()
    if not deleted:
        return JsonResponse({'error': 'Ejercicio no encontrado'}, status=404)
    return JsonResponse({'status': 'ok'})


@_vivir_api()
def vivir_meal_add(request):
    """Registra una comida. kcal = por porción; se guarda el total. Si la comida no está
    en las sugeridas, queda en la lista del usuario (VivirFood) para elegirla la próxima vez."""
    data = _json_body(request)
    if data is None:
        return JsonResponse({'error': 'JSON inválido'}, status=400)
    meal_type = data.get('meal_type')
    if meal_type not in VIVIR_MEAL_TYPES:
        return JsonResponse({'error': 'Tipo de comida inválido'}, status=400)
    description = str(data.get('description') or '').strip()[:200]
    if not description:
        return JsonResponse({'error': 'Contá qué comiste'}, status=400)
    try:
        kcal = _num(data.get('kcal'), int, 0, 10000)
        raw_portions = data.get('portions')
        portions = Decimal(str(1 if raw_portions in (None, '') else raw_portions).replace(',', '.'))
    except (TypeError, ValueError, InvalidOperation):
        return JsonResponse({'error': 'Calorías o porciones inválidas'}, status=400)
    if not portions.is_finite() or not Decimal('0.25') <= portions <= 20:
        return JsonResponse({'error': 'Porciones inválidas (0,25 a 20)'}, status=400)
    protein = bool(data.get('protein'))
    meal = VivirMeal.objects.create(
        user=request.user, date=_parse_date(data.get('date')), meal_type=meal_type,
        description=description, kcal=round(kcal * portions) if kcal is not None else None,
        portions=portions.quantize(Decimal('0.01')), protein=protein,
    )
    food = None
    if description.lower() not in VIVIR_FOOD_NAMES:
        food = VivirFood.objects.filter(user=request.user, name__iexact=description).first()
        if food is None:
            food = VivirFood(user=request.user, name=description)
        if kcal is not None:
            food.kcal = kcal
        food.protein = protein
        food.save()
    return JsonResponse({'status': 'ok', 'id': meal.id, 'food': _custom_food_dict(food) if food else None})


@_vivir_api(methods=('POST', 'DELETE'))
def vivir_food_delete(request, food_id):
    deleted, _ = VivirFood.objects.filter(id=food_id, user=request.user).delete()
    if not deleted:
        return JsonResponse({'error': 'Comida no encontrada'}, status=404)
    return JsonResponse({'status': 'ok'})


@_vivir_api(methods=('POST', 'DELETE'))
def vivir_meal_delete(request, meal_id):
    deleted, _ = VivirMeal.objects.filter(id=meal_id, user=request.user).delete()
    if not deleted:
        return JsonResponse({'error': 'Comida no encontrada'}, status=404)
    return JsonResponse({'status': 'ok'})


@_vivir_api()
def vivir_weight_add(request):
    """Registra el peso corporal de una fecha (si ya había uno ese día, lo reemplaza)."""
    data = _json_body(request)
    if data is None:
        return JsonResponse({'error': 'JSON inválido'}, status=400)
    try:
        kg = Decimal(str(data.get('weight_kg', '')).replace(',', '.'))
    except InvalidOperation:
        return JsonResponse({'error': 'Peso inválido'}, status=400)
    if not kg.is_finite() or not 25 <= kg <= 400:
        return JsonResponse({'error': 'Peso inválido (25 a 400 kg)'}, status=400)
    log, created = VivirBodyWeight.objects.update_or_create(
        user=request.user, date=_parse_date(data.get('date')),
        defaults={'weight_kg': kg.quantize(Decimal('0.1')), 'notes': str(data.get('notes') or '').strip()[:255]},
    )
    return JsonResponse({'status': 'ok', 'id': log.id, 'created': created, 'weight_kg': float(log.weight_kg)})


@_vivir_api(methods=('POST', 'DELETE'))
def vivir_weight_delete(request, log_id):
    deleted, _ = VivirBodyWeight.objects.filter(id=log_id, user=request.user).delete()
    if not deleted:
        return JsonResponse({'error': 'Registro no encontrado'}, status=404)
    return JsonResponse({'status': 'ok'})
