from django.db import models
from django.utils import timezone

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
