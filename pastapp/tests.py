import json

from django.contrib.auth.models import User
from django.test import TestCase, override_settings
from django.urls import reverse

from .models import VivirPlan, VivirSession, VivirBodyWeight, VivirExercise, VivirMeal


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

    def test_page_renders(self):
        res = self.client.get(reverse('vivir'))
        self.assertContains(res, 'Cómo progresar')

    def test_data_creates_plan_on_monday_of_current_week(self):
        # 2026-11-19 es jueves -> el ciclo arranca el lunes 16
        data = self.client.get(reverse('vivir_data'), {'date': '2026-11-19'}).json()
        self.assertEqual(data['start_date'], '2026-11-16')
        self.assertEqual(len(data['weeks']), 4)
        self.assertEqual(len(data['weeks'][0]['days']), 7)

    def test_session_upsert_and_weekly_totals(self):
        VivirPlan.objects.create(user=self.user, start_date='2026-11-16')
        self.post('vivir_session', {'date': '2026-11-17', 'done': True, 'minutes': 40})
        self.post('vivir_session', {'date': '2026-11-17', 'minutes': 45})
        self.post('vivir_session', {'date': '2026-11-24', 'done': True, 'minutes': 30})
        self.assertEqual(VivirSession.objects.count(), 2)
        data = self.client.get(reverse('vivir_data'), {'date': '2026-11-24'}).json()
        self.assertEqual(data['weeks'][1]['start'], '2026-11-23')
        self.assertEqual((data['weeks'][0]['done_count'], data['weeks'][0]['minutes_total']), (1, 45))
        self.assertEqual((data['weeks'][1]['done_count'], data['weeks'][1]['minutes_total']), (1, 30))
        self.assertTrue(data['weeks'][1]['days'][1]['done'])

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
        meals = self.client.get(reverse('vivir_day'), {'date': '2026-11-19'}).json()['meals']
        self.assertEqual((meals[0]['kcal'], meals[0]['protein']), (450, True))
        self.assertEqual(self.post('vivir_meal_delete', {}, res.json()['id']).status_code, 200)
        self.assertFalse(VivirMeal.objects.exists())
