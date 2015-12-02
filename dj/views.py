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
    page_all_url = request.META['HTTP_REFERER']
    page_url_without_http = page_all_url[page_all_url.find(r'//') + 2:]
    page_url = page_url_without_http[page_url_without_http.find(r'/') + 1:]

    sentence_in_page_id = request.POST.get('id', '')
    zh_sentence = request.POST.get('zh', '')
    en_sentence = request.POST.get('en', '')

    return_state = False

    if sentence_in_page_id != '' and zh_sentence != '' and en_sentence != '':
        sentence_obj = Sentence()
        sentence_obj.sentence_in_page_id = int(sentence_in_page_id)
        sentence_obj.page_url = page_url
        sentence_obj.zh_sentence = zh_sentence
        sentence_obj.en_sentence = en_sentence
        sentence_obj.create_date_time = datetime.now()
        sentence_obj.save()
        #TODO:关于全文翻译的增加，修改两种状态。
        return_state = True
    else:
        pass

    json_dict = {
        'state':return_state
    }
    json_obj = json.dumps(json_dict, ensure_ascii = False)
    return HttpResponse(json_obj, content_type="application/json")