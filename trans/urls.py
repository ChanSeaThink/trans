"""trans URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings

urlpatterns = [
    url(r'^superadmin/', include(admin.site.urls)),
    url(r'^django-docs/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.DOC_ROOT}),
    #url(r'^python-docs/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.DOC_ROOT_PY}),
    url(r'^$', 'dj.views.index'),
    #url(r'^py$', 'dj.views.py'),
    url(r'^getzh$', 'dj.views.getzh'),
    url(r'^savezh$', 'dj.views.savezh'),
    url(r'^sendenst$', 'dj.views.sendenst')
]
