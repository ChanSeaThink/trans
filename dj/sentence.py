#coding:utf8
import re

def del_html_tab(sentence):
    '''
    用于删除html标签，然后返回不含 html 标签的句子。
    '''
    re_str = r'<.*?>'
    re_obj = re.compile(re_str)
    pure_sentence = re_obj.sub('', sentence)
    return pure_sentence
