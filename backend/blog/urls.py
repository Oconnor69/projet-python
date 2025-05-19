from django.urls import path
from .views import api_home, register, login, get_all_blogs, get_user_blogs, create_blog, update_blog, delete_blog,auteur_detail,profil_auteur,modifier_profil_auteur

urlpatterns = [
    path('', api_home),
    path('register/', register),
    path('login/', login),
    path('blogs/', get_all_blogs),
    path('user-blogs/', get_user_blogs),
    path('create-blog/', create_blog),
    path('update-blog/<int:blog_id>/', update_blog),
    path('delete-blog/<int:blog_id>/', delete_blog),
    path('auteur/<int:auteur_id>/', auteur_detail, name='auteur-detail'),
    path('auteur/profil/', profil_auteur),  # GET avec ?email=
    path('auteur/modifier/', modifier_profil_auteur),  # PUT
    
]
