import json

from django.contrib.auth.models import User
from django.test import TestCase, override_settings
from django.urls import reverse

from .models import VivirPlan, VivirSession, VivirBodyWeight, VivirExercise, VivirMeal, VivirFood


@override_settings(STORAGES={
    'default': {'BACKEND': 'django.core.files.storage.FileSystemStorage'},
    'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'},
})
class VivirTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='ana')
        self.client.force_login(self.user)

    def post(self, name, payload, *args):
        return self.client.post(reverse(name, args=args), json.dumps(payload), content_type='application/json')

    def test_page_requires_login_and_redirects_back(self):
        self.client.logout()
        res = self.client.get(reverse('vivir'))
        self.assertRedirects(res, reverse('flexiones_login') + '?next=/vivir', fetch_redirect_response=False)
        # El login muestra la marca de la app a la que vuelve.
        self.assertContains(self.client.get(reverse('flexiones_login'), {'next': '/vivir'}), '<h1>Vivir</h1>', html=True)
        self.assertContains(self.client.get(reverse('flexiones_login')), '<h1>Flexiones</h1>', html=True)

    def test_page_renders(self):
        res = self.client.get(reverse('vivir'))
        self.assertContains(res, 'Cómo progresar')
        self.assertContains(res, 'Entrenamiento')

    def test_data_creates_plan_on_monday_of_current_week(self):
        # 2026-11-19 es jueves -> el ciclo arranca el lunes 16
        data = self.client.get(reverse('vivir_data'), {'date': '2026-11-19'}).json()
        self.assertEqual(data['start_date'], '2026-11-16')
        self.assertEqual((data['custom_foods'], data['last']), ([], {}))

    def test_week_summary_sessions_and_meals(self):
        self.post('vivir_session', {'date': '2026-11-17', 'done': True, 'minutes': 40})
        self.post('vivir_session', {'date': '2026-11-17', 'minutes': 45})
        self.post('vivir_session', {'date': '2026-11-24', 'done': True, 'minutes': 30})
        self.assertEqual(VivirSession.objects.count(), 2)
        self.post('vivir_meal_add', {'date': '2026-11-17', 'meal_type': 'almuerzo', 'description': 'Milanesa de carne', 'kcal': 350, 'protein': True})
        self.post('vivir_meal_add', {'date': '2026-11-17', 'meal_type': 'cena', 'description': 'Sopa'})
        week = self.client.get(reverse('vivir_week'), {'date': '2026-11-19'}).json()
        self.assertEqual((week['start'], week['end']), ('2026-11-16', '2026-11-22'))
        tue = week['days'][1]
        self.assertEqual((tue['done'], tue['minutes']), (True, 45))
        self.assertEqual(tue['meals'], {'count': 2, 'kcal': 350, 'kcal_known': 1, 'protein': 1})
        self.assertEqual(week['days'][0]['meals']['count'], 0)
        nxt = self.client.get(reverse('vivir_week'), {'date': '2026-11-24'}).json()
        self.assertEqual(nxt['days'][1]['minutes'], 30)

    def test_new_cycle_normalizes_to_monday(self):
        res = self.post('vivir_start', {'date': '2026-12-03'})
        self.assertEqual(res.json()['start_date'], '2026-11-30')
        self.assertEqual(str(VivirPlan.objects.get(user=self.user).start_date), '2026-11-30')

    def test_body_weight_add_upsert_validate_and_delete(self):
        res = self.post('vivir_weight_add', {'date': '2026-11-16', 'weight_kg': '82,5', 'notes': 'en ayunas'})
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json()['created'])
        # Mismo día: reemplaza en vez de duplicar.
        res = self.post('vivir_weight_add', {'date': '2026-11-16', 'weight_kg': 82})
        self.assertFalse(res.json()['created'])
        log = VivirBodyWeight.objects.get()
        self.assertEqual((float(log.weight_kg), log.notes), (82.0, ''))
        self.assertEqual(self.post('vivir_weight_add', {'weight_kg': 'abc'}).status_code, 400)
        self.assertEqual(self.post('vivir_weight_add', {'weight_kg': 5}).status_code, 400)
        data = self.client.get(reverse('vivir_data')).json()
        self.assertEqual(data['body_weights'], [{'id': log.id, 'date': '2026-11-16', 'weight_kg': 82.0, 'notes': ''}])

        other = User.objects.create_user(username='otro')
        foreign = VivirBodyWeight.objects.create(user=other, date='2026-11-16', weight_kg=70)
        self.assertEqual(self.post('vivir_weight_delete', {}, foreign.id).status_code, 404)
        self.assertEqual(self.post('vivir_weight_delete', {}, log.id).status_code, 200)
        self.assertEqual(VivirBodyWeight.objects.filter(user=self.user).count(), 0)

    def test_api_requires_auth(self):
        self.client.logout()
        self.assertEqual(self.client.get(reverse('vivir_data')).status_code, 401)
        self.assertEqual(self.post('vivir_session', {'done': True}).status_code, 401)
        self.assertEqual(self.client.get(reverse('vivir_day')).status_code, 401)
        self.assertEqual(self.post('vivir_meal_add', {}).status_code, 401)

    def test_routine_change_resets_items_and_day_endpoint(self):
        items = [{'name': 'Bici', 'volume': '20 min', 'met': 6, 'minutes': 20}]
        self.post('vivir_session', {'date': '2026-11-10', 'items': items})
        day = self.client.get(reverse('vivir_day'), {'date': '2026-11-10'}).json()
        self.assertEqual(day['session']['items'][0]['name'], 'Bici')
        self.assertEqual(day['session']['routine'], '')

        res = self.post('vivir_session', {'date': '2026-11-10', 'routine': 'movilidad'}).json()
        self.assertEqual(res['session']['routine'], 'movilidad')
        self.assertIsNone(res['session']['items'])

        self.assertEqual(self.post('vivir_session', {'date': '2026-11-10', 'routine': 'nada'}).status_code, 400)
        self.assertEqual(self.post('vivir_session', {'date': '2026-11-10', 'items': [{'name': ''}]}).status_code, 400)
        self.assertEqual(self.post('vivir_session', {'date': '2026-11-10', 'items': 'x'}).status_code, 400)

    def test_water_is_clamped(self):
        res = self.post('vivir_session', {'date': '2026-11-10', 'water': 99}).json()
        self.assertEqual(res['session']['water'], 30)

    def test_custom_exercise_add_duplicate_and_delete(self):
        res = self.post('vivir_exercise_add', {'name': 'Soga', 'met': 8, 'minutes': 10})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(self.post('vivir_exercise_add', {'name': 'soga', 'met': 8, 'minutes': 10}).status_code, 400)
        self.assertEqual(self.post('vivir_exercise_add', {'name': 'Bici', 'met': 5, 'minutes': 10}).status_code, 400)
        self.assertEqual(self.post('vivir_exercise_add', {'name': 'X', 'met': 99, 'minutes': 10}).status_code, 400)
        data = self.client.get(reverse('vivir_data')).json()
        self.assertEqual([e['name'] for e in data['custom_exercises']], ['Soga'])
        ex_id = res.json()['exercise']['id']
        self.assertEqual(self.post('vivir_exercise_delete', {}, ex_id).status_code, 200)
        self.assertFalse(VivirExercise.objects.exists())

    def test_meals_add_list_delete(self):
        res = self.post('vivir_meal_add', {'date': '2026-11-19', 'meal_type': 'almuerzo', 'description': 'Lentejas', 'kcal': '450', 'protein': True})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(self.post('vivir_meal_add', {'meal_type': 'brunch', 'description': 'x'}).status_code, 400)
        self.assertEqual(self.post('vivir_meal_add', {'meal_type': 'cena', 'description': ''}).status_code, 400)
        self.assertEqual(self.post('vivir_meal_add', {'meal_type': 'cena', 'description': 'x', 'portions': 0}).status_code, 400)
        meals = self.client.get(reverse('vivir_day'), {'date': '2026-11-19'}).json()['meals']
        self.assertEqual((meals[0]['kcal'], meals[0]['protein'], meals[0]['portions']), (450, True, 1.0))
        self.assertEqual(self.post('vivir_meal_delete', {}, res.json()['id']).status_code, 200)
        self.assertFalse(VivirMeal.objects.exists())

    def test_new_food_is_saved_to_user_list_and_portions_scale_kcal(self):
        res = self.post('vivir_meal_add', {'date': '2026-11-19', 'meal_type': 'cena', 'description': 'Tortilla de papas', 'kcal': 300, 'portions': 1.5, 'protein': True}).json()
        self.assertEqual(VivirMeal.objects.get().kcal, 450)
        self.assertEqual(res['food']['name'], 'Tortilla de papas')
        # La misma comida otra vez (otra mayúscula) actualiza, no duplica.
        self.post('vivir_meal_add', {'date': '2026-11-20', 'meal_type': 'cena', 'description': 'tortilla de papas', 'kcal': 320, 'protein': True})
        food = VivirFood.objects.get()
        self.assertEqual(food.kcal, 320)
        # Las sugeridas no se copian a la lista propia.
        self.post('vivir_meal_add', {'date': '2026-11-20', 'meal_type': 'cena', 'description': 'Empanada', 'kcal': 280})
        self.assertEqual(VivirFood.objects.count(), 1)
        data = self.client.get(reverse('vivir_data')).json()
        self.assertEqual([f['name'] for f in data['custom_foods']], ['Tortilla de papas'])
        self.assertEqual(self.post('vivir_food_delete', {}, food.id).status_code, 200)
        self.assertFalse(VivirFood.objects.exists())

    def test_items_keep_sets_reps_kg_and_cardio_fields(self):
        items = [
            {'name': 'Remo', 'met': 3.5, 'minutes': 9, 'mode': 'reps', 'sets': 3, 'reps': 12, 'kg': 22.5, 'per_rep': 0.25},
            {'name': 'Bici', 'met': 6, 'minutes': 35, 'mode': 'cardio', 'km': 12.4, 'rpm': 80},
        ]
        res = self.post('vivir_session', {'date': '2026-11-18', 'items': items}).json()
        saved = res['session']['items']
        self.assertEqual((saved[0]['sets'], saved[0]['reps'], saved[0]['kg']), (3, 12, 22.5))
        self.assertEqual((saved[1]['km'], saved[1]['rpm'], saved[1]['mode']), (12.4, 80, 'cardio'))
        bad = [{'name': 'Remo', 'met': 3.5, 'minutes': 9, 'sets': 999}]
        self.assertEqual(self.post('vivir_session', {'date': '2026-11-18', 'items': bad}).status_code, 400)
        last = self.client.get(reverse('vivir_data')).json()['last']
        self.assertEqual((last['Remo']['kg'], last['Bici']['km']), (22.5, 12.4))

    def test_items_keep_individual_sets(self):
        items = [{'name': 'Bíceps', 'met': 3.5, 'minutes': 8, 'mode': 'reps', 'per_rep': 0.25,
                  'set_list': [{'reps': 12, 'kg': 20}, {'reps': 10, 'kg': 22.5}, {'reps': 8, 'kg': 25}, {'reps': '', 'kg': ''}]}]
        saved = self.post('vivir_session', {'date': '2026-11-18', 'items': items}).json()['session']['items']
        self.assertEqual(saved[0]['set_list'], [{'reps': 12, 'kg': 20.0}, {'reps': 10, 'kg': 22.5}, {'reps': 8, 'kg': 25.0}])
        bad = [{'name': 'Bíceps', 'met': 3.5, 'minutes': 8, 'set_list': [{'reps': 9999}]}]
        self.assertEqual(self.post('vivir_session', {'date': '2026-11-18', 'items': bad}).status_code, 400)
        last = self.client.get(reverse('vivir_data')).json()['last']
        self.assertEqual(len(last['Bíceps']['set_list']), 3)

    def test_profile_for_base_burn(self):
        res = self.post('vivir_profile', {'sex': 'M', 'birth_year': 1985, 'height_cm': 178})
        self.assertEqual(res.json()['profile'], {'sex': 'M', 'birth_year': 1985, 'height_cm': 178})
        self.assertEqual(self.client.get(reverse('vivir_data')).json()['profile']['height_cm'], 178)
        self.assertEqual(self.post('vivir_profile', {'sex': 'X'}).status_code, 400)
        self.assertEqual(self.post('vivir_profile', {'height_cm': 20}).status_code, 400)
        # Se puede dejar vacío (vuelve a la estimación por kg).
        self.assertEqual(self.post('vivir_profile', {}).json()['profile'], {'sex': '', 'birth_year': None, 'height_cm': None})

    def test_month_span(self):
        self.post('vivir_session', {'date': '2026-02-27', 'done': True, 'minutes': 30})
        res = self.client.get(reverse('vivir_week'), {'date': '2026-02-10', 'span': 'month'}).json()
        self.assertEqual((res['start'], res['end'], len(res['days'])), ('2026-02-01', '2026-02-28', 28))
        self.assertTrue(res['days'][26]['done'])
        dec = self.client.get(reverse('vivir_week'), {'date': '2026-12-31', 'span': 'month'}).json()
        self.assertEqual((dec['start'], dec['end']), ('2026-12-01', '2026-12-31'))

    def test_walk_items_keep_steps(self):
        items = [{'name': 'Caminata rápida', 'met': 4.3, 'minutes': 30, 'mode': 'cardio', 'km': 3.2, 'steps': 4100}]
        saved = self.post('vivir_session', {'date': '2026-11-18', 'items': items}).json()['session']['items']
        self.assertEqual((saved[0]['steps'], saved[0]['km']), (4100, 3.2))
        bad = [{'name': 'Caminata rápida', 'met': 4.3, 'minutes': 30, 'steps': -5}]
        self.assertEqual(self.post('vivir_session', {'date': '2026-11-18', 'items': bad}).status_code, 400)
        self.assertEqual(self.client.get(reverse('vivir_data')).json()['last']['Caminata rápida']['steps'], 4100)
