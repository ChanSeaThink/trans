# -*- coding: utf8 -*-
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

    content_data = None
    if content == '':
        pass
    else:
        #补充有数据时的的content_data
        pass
    #print 'content_json', content_json

    json_dict = {
        'content':content_data
    }
    json_obj = json.dumps(json_dict, ensure_ascii = False)
    return HttpResponse(json_obj, content_type="application/json")


def savezh(request):
    return HttpResponse('savezh')