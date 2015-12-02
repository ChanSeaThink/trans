from django.shortcuts import render
from django.http import HttpResponseRedirect

# Create your views here.
def index(request):
    return HttpResponseRedirect('django-docs/index.html')