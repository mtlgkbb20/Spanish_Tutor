from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required

@login_required
def assignment_list(request):
    assignments = [
        {'id': 1, 'title': 'Selamlaşma Cümleleri Yazın', 'due_date': '2025-06-20'},
        {'id': 2, 'title': 'Rakamları Kullanarak Cümle Kurun', 'due_date': '2025-06-25'},
    ]
    return render(request, 'assignment_list.html', {'assignments': assignments})

@login_required
def assignment_detail(request, assignment_id):
    assignment = {
        'id': assignment_id,
        'title': 'Selamlaşma Cümleleri Yazın',
        'description': 'Örnek cümlelerle 5 adet selamlaşma cümlesi yazın.',
        'due_date': '2025-06-20'
    }
    submission = None
    # Gerçek veritabanı işlemleri burada yapılacak
    if request.method == 'POST':
        content = request.POST.get('submission_content', '').strip()
        # MongoDB’ye kaydetme işlemi (örnek)
        # Submission.objects.create(user=request.user, assignment_id=assignment_id, submission_content=content)
        # Sonra sayfayı yeniden yükle
        return redirect(reverse('assignment_detail', args=[assignment_id]))

    # Eğer teslim ettiyse:
    # submission = Submission.objects.filter(user=request.user, assignment_id=assignment_id).first()
    # eğer submission varsa:
    #   submission = {'submission_content': submission.submission_content, 'feedback': submission.feedback}

    return render(request, 'assignment_detail.html', {
        'assignment': assignment,
        'submission': submission
    })
