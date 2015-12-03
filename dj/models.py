# -*- coding: utf8 -*-
from django.db import models

# Create your models here.

class Sentence(models.Model):
    '''
    用于存储每个翻译的句子。
    '''

    sentence_id = models.AutoField(primary_key=True)
    sentence_in_page_id = models.IntegerField()
    page_url = models.TextField(unique=True)
    zh_sentence = models.TextField()
    en_sentence = models.TextField()
    create_date_time = models.DateTimeField()


class Content(models.Model):
    '''
    用于存储页面完整的翻译信息内容。
    '''

    content_id = models.AutoField(primary_key=True)
    page_url = models.TextField(unique=True)
    content = models.TextField()
    create_date_time = models.DateTimeField()
    update_date_time = models.DateTimeField()