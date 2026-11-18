import json

from django.contrib.auth.models import User
from django.test import TestCase, override_settings
from django.urls import reverse

from .models import VivirPlan, VivirSession, VivirWeightLog


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
        self.assertEqual(data['current_week'], 1)
        self.assertEqual(len(data['weeks']), 4)
        self.assertEqual(len(data['weeks'][0]['days']), 7)

    def test_session_upsert_and_weekly_totals(self):
        VivirPlan.objects.create(user=self.user, start_date='2026-11-16')
        self.post('vivir_session', {'date': '2026-11-17', 'done': True, 'minutes': 40})
        self.post('vivir_session', {'date': '2026-11-17', 'minutes': 45})
        self.post('vivir_session', {'date': '2026-11-24', 'done': True, 'minutes': 30})
        self.assertEqual(VivirSession.objects.count(), 2)
        data = self.client.get(reverse('vivir_data'), {'date': '2026-11-24'}).json()
        self.assertEqual(data['current_week'], 2)
        self.assertEqual((data['weeks'][0]['done_count'], data['weeks'][0]['minutes_total']), (1, 45))
        self.assertEqual((data['weeks'][1]['done_count'], data['weeks'][1]['minutes_total']), (1, 30))
        self.assertTrue(data['today_session']['done'])

    def test_new_cycle_normalizes_to_monday(self):
        res = self.post('vivir_start', {'date': '2026-12-03'})
        self.assertEqual(res.json()['start_date'], '2026-11-30')
        self.assertEqual(str(VivirPlan.objects.get(user=self.user).start_date), '2026-11-30')

    def test_weight_add_validate_and_delete(self):
        res = self.post('vivir_weight_add', {'date': '2026-11-16', 'exercise': 'Remo', 'weight_kg': '22,5', 'sets': 3, 'reps': 10})
        self.assertEqual(res.status_code, 200)
        log = VivirWeightLog.objects.get()
        self.assertEqual(float(log.weight_kg), 22.5)
        self.assertEqual(self.post('vivir_weight_add', {'exercise': '', 'weight_kg': 10}).status_code, 400)
        self.assertEqual(self.post('vivir_weight_add', {'exercise': 'Remo', 'weight_kg': 'abc'}).status_code, 400)

        other = User.objects.create_user(username='otro')
        foreign = VivirWeightLog.objects.create(user=other, date='2026-11-16', exercise='Remo', weight_kg=10)
        self.assertEqual(self.post('vivir_weight_delete', {}, foreign.id).status_code, 404)
        self.assertEqual(self.post('vivir_weight_delete', {}, log.id).status_code, 200)
        self.assertEqual(VivirWeightLog.objects.filter(user=self.user).count(), 0)

    def test_api_requires_auth(self):
        self.client.logout()
        self.assertEqual(self.client.get(reverse('vivir_data')).status_code, 401)
        self.assertEqual(self.post('vivir_session', {'done': True}).status_code, 401)
