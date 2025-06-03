from django.shortcuts import render

def lesson_list(request):
    lessons = [
        {'id': 1, 'module_title': 'Selamlaşma ve Tanışma', 'completed': True},
        {'id': 2, 'module_title': 'Temel Fiil Çekimleri', 'completed': False},
        {'id': 3, 'module_title': 'Sayılar ve Tarihler', 'completed': False},
        # …
    ]
    return render(request, './lessons/lesson_list.html', {'lessons': lessons})

def lesson_detail(request, lesson_id):
    # Gerçek veri yerine örnek bir sözlük:
    lesson = {
        'id': lesson_id,
        'module_title': 'Selamlaşma ve Tanışma',
        'content': 'Örnek ders içeriği…'
    }
    return render(request, 'lesson_detail.html', {'lesson': lesson})
