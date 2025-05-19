from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class Auteur(models.Model):
    nom = models.CharField(max_length=50, blank=True, null=True)
    prenom = models.CharField(max_length=50,blank=True, null=True)
    email = models.EmailField(max_length=191, unique=True, blank=True, null=True)
    password = models.CharField(max_length=128, blank=True, null=True)  # Stockage haché du mot de passe
    photo = models.ImageField(upload_to='auteurs/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True, verbose_name="Biographie")

    def __str__(self):
        return f"{self.prenom} {self.nom}"

    def set_password(self, raw_password):
        """Hash et enregistre le mot de passe"""
        self.password = make_password(raw_password)
    
    def check_password(self, raw_password):
        """Vérifie si le mot de passe est correct"""
        return check_password(raw_password, self.password)
# Modèle de blog
class Blog(models.Model):
    Auteur = models.ForeignKey(Auteur, on_delete=models.CASCADE, related_name='blogs', verbose_name="Auteur")
    title = models.CharField(max_length=100, verbose_name="Titre")
    content = models.TextField(verbose_name="Contenu")
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True, verbose_name="Image")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Mis à jour le")

    def __str__(self):
        return self.title

# Modèle de commentaire
class Comment(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='comments')
    Auteur = models.ForeignKey(Auteur, on_delete=models.CASCADE, related_name='comments', blank=True, null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Commentaire de {self.Auteur.username} sur {self.blog.title}"
