from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Verb(models.Model):
    group = models.CharField(max_length=50)
    infinitive = models.CharField(max_length=100)
    past_tense = models.CharField(max_length=100)
    spanish = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.infinitive} - {self.past_tense} - {self.group}"

class PlayLog(models.Model):
    player_name = models.CharField(max_length=100)
    target_verb = models.CharField(max_length=100)
    attempt_word = models.CharField(max_length=100)
    is_correct = models.BooleanField()
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        status = "HIT" if self.is_correct else "MISS"
        return f"[{status}] {self.player_name}: {self.attempt_word} (Target: {self.target_verb})"

class PushUpLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.IntegerField()
    date = models.DateField()
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} - {self.date}: {self.amount} flexiones"

class PushUpGoal(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    daily = models.IntegerField(default=100)
    weekly = models.IntegerField(default=500)
    monthly = models.IntegerField(default=2000)

    def __str__(self):
        return f"{self.user.username} Goals (D: {self.daily}, W: {self.weekly}, M: {self.monthly})"


class VivirPlan(models.Model):
    """Ciclo de 4 semanas de la rutina /vivir: la semana 1 arranca en start_date."""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    start_date = models.DateField()

    def __str__(self):
        return f"{self.user.username} - rutina desde {self.start_date}"

class VivirSession(models.Model):
    """Una sesión diaria de la rutina: casilla de completado + minutos."""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    done = models.BooleanField(default=False)
    minutes = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"{self.user.username} - {self.date}: {'OK' if self.done else '-'} {self.minutes} min"

class VivirWeightLog(models.Model):
    """Registro de pesos: fecha, ejercicio, peso, series, reps, notas."""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    exercise = models.CharField(max_length=100)
    weight_kg = models.DecimalField(max_digits=6, decimal_places=2)
    sets = models.PositiveIntegerField(default=0)
    reps = models.PositiveIntegerField(default=0)
    notes = models.CharField(max_length=255, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} - {self.date} {self.exercise}: {self.weight_kg} kg {self.sets}x{self.reps}"
