from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Her bir app için include
    path('users/', include('users.urls')),
    path('lessons/', include('lessons.urls')),
    path('assignments/', include('assignments.urls')),
    path('exams/', include('exams.urls')),
]
