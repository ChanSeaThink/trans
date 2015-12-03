from django.contrib import admin
from models import *
# Register your models here.
class SentenceAdmin(admin.ModelAdmin):
    list_display = ('sentence_id', 'sentence_in_page_id', 'page_url', 'zh_sentence', 'en_sentence', 'create_date_time')


class ContentAdmin(admin.ModelAdmin):
    list_display = ('content_id', 'page_url', 'content', 'create_date_time', 'update_date_time')


admin.site.register(Sentence, SentenceAdmin)
admin.site.register(Content, ContentAdmin)