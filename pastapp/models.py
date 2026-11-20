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
    # Perfil para el gasto base diario (Mifflin-St Jeor). Vacío = estimación por kg.
    SEXES = [('M', 'Hombre'), ('F', 'Mujer')]
    sex = models.CharField(max_length=1, choices=SEXES, blank=True)
    birth_year = models.PositiveSmallIntegerField(null=True, blank=True)
    height_cm = models.PositiveSmallIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - rutina desde {self.start_date}"

class VivirSession(models.Model):
    """Una sesión diaria de la rutina: completado, minutos, rutina elegida e ítems."""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    done = models.BooleanField(default=False)
    minutes = models.PositiveIntegerField(default=0)
    # Clave de VIVIR_ROUTINES; vacío = la sugerida para ese día de la semana.
    routine = models.CharField(max_length=40, blank=True)
    # Lista de ítems editada por el usuario; null = los de la rutina sin cambios.
    items = models.JSONField(null=True, blank=True)
    water = models.PositiveSmallIntegerField(default=0)  # vasos de agua

    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"{self.user.username} - {self.date}: {'OK' if self.done else '-'} {self.minutes} min"

class VivirBodyWeight(models.Model):
    """Registro del peso corporal (uno por día). El último vigente se usa para las kcal."""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    weight_kg = models.DecimalField(max_digits=5, decimal_places=1)
    notes = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"{self.user.username} - {self.date}: {self.weight_kg} kg"

class VivirExercise(models.Model):
    """Ejercicio propio del usuario, que se suma al catálogo fijo (VIVIR_EXERCISES)."""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    met = models.DecimalField(max_digits=4, decimal_places=1)  # esfuerzo (MET)
    minutes = models.PositiveIntegerField(default=10)
    volume = models.CharField(max_length=50, blank=True)
    # Cómo se registra: series y reps, cardio (minutos, km, rpm) o libre (minutos).
    MODES = [('reps', 'Series y repeticiones'), ('cardio', 'Cardio'), ('free', 'Libre')]
    mode = models.CharField(max_length=10, choices=MODES, default='free')

    def __str__(self):
        return f"{self.user.username} - {self.name} ({self.met} MET)"


class VivirFood(models.Model):
    """Comida propia del usuario (se guarda al registrar una nueva) con sus kcal por porción."""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    kcal = models.PositiveIntegerField(null=True, blank=True)  # por porción
    protein = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.name} ({self.kcal} kcal)"

class VivirMeal(models.Model):
    MEAL_TYPES = [
        ('desayuno', 'Desayuno'),
        ('almuerzo', 'Almuerzo'),
        ('merienda', 'Merienda'),
        ('cena', 'Cena'),
        ('snack', 'Colación'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPES)
    description = models.CharField(max_length=200)
    kcal = models.PositiveIntegerField(null=True, blank=True)  # total (kcal por porción × porciones)
    portions = models.DecimalField(max_digits=4, decimal_places=2, default=1)
    protein = models.BooleanField(default=False)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} - {self.date} {self.meal_type}: {self.description}"
