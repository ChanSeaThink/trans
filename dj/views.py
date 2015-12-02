from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from datetime import datetime
import json

# Create your views here.
def index(request):
    return HttpResponseRedirect('django-docs/index.html')


def getzh(request):
    
    return HttpResponse('getzh')


def savezh(request):
    return HttpResponse('savezh')