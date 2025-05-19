#Dans models.py

#django-admin startproject mycrud
#cd mycrud
#python manage.py startapp app


INSTALLED_APPS = [
    ...
    'app',
]


#models pour db 
# app/models.py
from django.db import models

class Item(models.Model):
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    prix = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.nom

#views 
# app/views.py
from django.shortcuts import render, redirect, get_object_or_404
from .models import Item
from .forms import ItemForm

def item_list(request):
    items = Item.objects.all() 
    return render(request, 'app/item_list.html', {'items': items})

def item_create(request):
    if request.method == 'POST':
        form = ItemForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('item_list')
    else:
        form = ItemForm()
    return render(request, 'app/item_form.html', {'form': form})

def item_update(request, pk):
    item = get_object_or_404(Item, pk=pk)
    if request.method == 'POST':
        form = ItemForm(request.POST, instance=item)
        if form.is_valid():
            form.save()
            return redirect('item_list')
    else:
        form = ItemForm(instance=item)
    return render(request, 'app/item_form.html', {'form': form})

def item_delete(request, pk):
    item = get_object_or_404(Item, pk=pk)
    if request.method == 'POST':
        item.delete()
        return redirect('item_list')
    return render(request, 'app/item_confirm_delete.html', {'item': item})

# app/forms.py
from django import forms
from .models import Item

class ItemForm(forms.ModelForm):
    class Meta:
        model = Item
        fields = '__all__'


# app/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.item_list, name='item_list'),
    path('create/', views.item_create, name='item_create'),
    path('update/<int:pk>/', views.item_update, name='item_update'),
    path('delete/<int:pk>/', views.item_delete, name='item_delete'),
]

#main proj
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('app.urls')),
]

#templates/app/item_list.html
<h2>Liste des items</h2>
<a href="{% url 'item_create' %}">Créer un nouvel item</a>
<ul>
  {% for item in items %}
    <li>{{ item.nom }} - {{ item.prix }} DH
        <a href="{% url 'item_update' item.id %}">Modifier</a> |
        <a href="{% url 'item_delete' item.id %}">Supprimer</a>
    </li>
  {% endfor %}
</ul>

templates/app/item_form.html

<h2>Formulaire Item</h2>
<form method="post">
  {% csrf_token %}
  {{ form.as_p }}
  <button type="submit">Enregistrer</button>
</form>
<a href="{% url 'item_list' %}">Retour</a>


templates/app/item_confirm_delete.html

<h2>Supprimer "{{ item.nom }}" ?</h2>
<form method="post">
  {% csrf_token %}
  <button type="submit">Oui, supprimer</button>
</form>
<a href="{% url 'item_list' %}">Annuler</a>


