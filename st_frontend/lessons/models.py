# lessons/models.py
from django.db import models

class Lesson(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True)   # Öğretmen LLM tarafından doldurulacak metni buraya kaydedebiliriz
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
