from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required

@login_required
def exam_list(request):
    exam_results = [
        {'taken_at': '2025-05-20', 'score': 85, 'passed': True},
        {'taken_at': '2025-04-15', 'score': 62, 'passed': False},
    ]
    return render(request, 'exam_list.html', {'exam_results': exam_results})

@login_required
def exam_detail(request, exam_id):
    exam = {
        'id': exam_id,
        'questions': [
            {'q': '“Merhaba” İspanyolca’da nasıl yazılır?', 'type': 'text'},
            {'q': '“Teşekkür ederim” çeviriniz.', 'type': 'text'},
            # …
        ]
    }
    result = None
    if request.method == 'POST':
        # Puanlama işlemini burada yapabilirsiniz (örnek eşleştirme)
        # score = hesapla(...)
        # passed = True/False
        # ExamResult.objects.create(user=request.user, exam_id=exam_id, score=score, passed=passed)
        return redirect('exam_list')

    return render(request, 'exam_detail.html', {'exam': exam, 'result': result})
