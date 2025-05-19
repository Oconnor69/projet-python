from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def api_home(request):
    return Response({"message": "Bienvenue dans l'API Blog!"})
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Auteur
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes

@csrf_exempt
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def register(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')
    prenom = data.get('prenom')
    nom = data.get('nom')
    bio = data.get('bio')
    photo = request.FILES.get('photo')  # pour le fichier image

    if Auteur.objects.filter(email=email).exists():
        return Response({'message': 'Email déjà utilisé'}, status=400)

    auteur = Auteur(email=email, prenom=prenom, nom=nom, bio=bio, photo=photo)
    auteur.set_password(password)
    auteur.save()

    return Response({'message': 'Inscription réussie', 'user_id': auteur.id})

@csrf_exempt
@api_view(['POST'])
def login(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    try:
        auteur = Auteur.objects.get(email=email)
        if auteur.check_password(password):
            return Response({'message': 'Connexion réussie', 'user_id': auteur.id})
        else:
            return Response({'message': 'Mot de passe incorrect'}, status=401)
    except Auteur.DoesNotExist:
        return Response({'message': 'Utilisateur non trouvé'}, status=404)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Blog
from django.conf import settings

@api_view(['GET'])
def get_all_blogs(request):
    search = request.GET.get('search', '').strip().lower()
    blogs = Blog.objects.select_related('Auteur').all().order_by('-created_at')

    if search:
        blogs = blogs.filter(title__icontains=search)

    data = []
    for blog in blogs:
        data.append({
            'id': blog.id,
            'title': blog.title,
            'content': blog.content,
            'image': request.build_absolute_uri(blog.image.url) if blog.image else None,
            'auteur': f"{blog.Auteur.prenom} {blog.Auteur.nom}",
            'auteur_id': blog.Auteur.id,  # ← cette ligne est essentielle
            'created_at': blog.created_at.strftime('%Y-%m-%d %H:%M') if blog.created_at else '',
        })
    
    return Response(data)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Blog, Auteur
from django.views.decorators.csrf import csrf_exempt

@api_view(['GET'])
def get_user_blogs(request):
    user_email = request.GET.get('email')
    auteur = Auteur.objects.filter(email=user_email).first()
    if not auteur:
        return Response({"error": "Auteur introuvable"}, status=404)
    
    blogs = Blog.objects.filter(Auteur=auteur)
    data = [{
        "id": blog.id,
        "title": blog.title,
        "content": blog.content,
        "image": blog.image.url if blog.image else None,
        "created_at": blog.created_at.strftime("%Y-%m-%d %H:%M") if blog.created_at else None
    } for blog in blogs]
    return Response(data)


@api_view(['POST'])
@csrf_exempt
def create_blog(request):
    data = request.data
    auteur = Auteur.objects.filter(email=data.get('email')).first()
    if not auteur:
        return Response({"error": "Auteur non trouvé"}, status=404)
    
    blog = Blog.objects.create(
        Auteur=auteur,
        title=data.get('title'),
        content=data.get('content'),
        image=request.FILES.get("image")
    )
    return Response({"message": "Blog créé", "id": blog.id})

from django.http import HttpRequest
@api_view(['PUT'])
@csrf_exempt
def update_blog(request, blog_id):
    django_request = request._request
    try:
        blog = Blog.objects.get(id=blog_id)
        blog.title = request.data.get("title")
        blog.content = request.data.get("content")
        if request.FILES.get("image"):
            blog.image = request.FILES.get("image")
        blog.save()
        return Response({"success": True})
    except Blog.DoesNotExist:
        return Response({"error": "Blog not found"}, status=404)


@api_view(['DELETE'])
@csrf_exempt
def delete_blog(request, blog_id):
    blog = Blog.objects.filter(id=blog_id).first()
    if not blog:
        return Response({"error": "Blog introuvable"}, status=404)
    
    blog.delete()
    return Response({"message": "Blog supprimé"})

@api_view(['GET'])
def auteur_detail(request, auteur_id):
    print("Vue appelée avec id={auteur_id}")
    try:
        auteur = Auteur.objects.get(id=auteur_id)
    except Auteur.DoesNotExist:
        return Response({"error": "Auteur non trouvé"}, status=404)

    blogs = Blog.objects.filter(Auteur=auteur).order_by('-created_at')
    blog_data = [{
        "id": blog.id,
        "title": blog.title,
        "content": blog.content,
        "image": request.build_absolute_uri(blog.image.url) if blog.image else None,
        "created_at": blog.created_at.strftime("%Y-%m-%d %H:%M"),
    } for blog in blogs]

    auteur_data = {
        "id": auteur.id,
        "prenom": auteur.prenom,
        "nom": auteur.nom,
        "email": auteur.email,
        "bio": auteur.bio,
        "photo": request.build_absolute_uri(auteur.photo.url) if auteur.photo and hasattr(auteur.photo, 'url') else None,

        "blogs": blog_data,
        
    }
    return Response(auteur_data)

@api_view(['GET'])
def profil_auteur(request):
    email = request.GET.get('email')
    if not email:
        return Response({"error": "Email requis"}, status=400)

    try:
        auteur = Auteur.objects.get(email=email)
    except Auteur.DoesNotExist:
        return Response({"error": "Auteur non trouvé"}, status=404)

    data = {
        "id": auteur.id,
        "prenom": auteur.prenom,
        "nom": auteur.nom,
        "email": auteur.email,
        "bio": auteur.bio,
        "photo": request.build_absolute_uri(auteur.photo.url) if auteur.photo and hasattr(auteur.photo, 'url') else None,
    }

    return Response(data)

@csrf_exempt
@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])
def modifier_profil_auteur(request):
    data = request.data
    email = data.get('email')
    if not email:
        return Response({"error": "Email requis"}, status=400)

    try:
        auteur = Auteur.objects.get(email=email)
    except Auteur.DoesNotExist:
        return Response({"error": "Auteur non trouvé"}, status=404)

    auteur.prenom = data.get('prenom', auteur.prenom)
    auteur.nom = data.get('nom', auteur.nom)
    auteur.bio = data.get('bio', auteur.bio)
    if request.FILES.get('photo'):
        auteur.photo = request.FILES.get('photo')
    if data.get('password'):
        auteur.set_password(data.get('password'))
    auteur.save()

    return Response({"message": "Profil mis à jour"})

