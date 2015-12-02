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
                ('page_url', models.TextField()),
                ('content', models.TextField()),
                ('create_date_time', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Sentence',
            fields=[
                ('sentence_id', models.AutoField(serialize=False, primary_key=True)),
                ('page_url', models.TextField()),
                ('zh_sentence', models.TextField()),
                ('en_sentence', models.TextField()),
                ('create_date_time', models.DateTimeField()),
            ],
        ),
    ]
