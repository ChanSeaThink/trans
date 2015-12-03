# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Content',
            fields=[
                ('content_id', models.AutoField(serialize=False, primary_key=True)),
                ('page_url', models.TextField(unique=True)),
                ('content', models.TextField()),
                ('create_date_time', models.DateTimeField()),
                ('update_date_time', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Sentence',
            fields=[
                ('sentence_id', models.AutoField(serialize=False, primary_key=True)),
                ('sentence_in_page_id', models.IntegerField()),
                ('page_url', models.TextField(unique=True)),
                ('zh_sentence', models.TextField()),
                ('en_sentence', models.TextField()),
                ('create_date_time', models.DateTimeField()),
            ],
        ),
    ]
