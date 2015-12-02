from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from datetime import datetime
from dj.models import *
import json

# Create your views here.
def index(request):
    return HttpResponseRedirect('django-docs/index.html')


def getzh(request):
    page_all_url = request.META['HTTP_REFERER']
    page_url_without_http = page_all_url[page_all_url.find(r'//') + 2:]
    page_url = page_url_without_http[page_url_without_http.find(r'/') + 1:]
    #print page_url

    content = ''
    try:
        content_obj = Content.objects.get(page_url = page_url)
        content = content_obj.content
    except Content.DoesNotExist:
        pass
    print content_obj.content_id
    return HttpResponse('getzh')


def savezh(request):
    return HttpResponse('savezh')