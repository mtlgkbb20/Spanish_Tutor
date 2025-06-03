# exams/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Exam(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # soru seti vs. ek alanlar ileride eklenebilir.

    def __str__(self):
        return self.title

class ExamResult(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField()
    passed = models.BooleanField(default=False)
    taken_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} – {self.exam.title} – {self.score}'
