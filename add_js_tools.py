# -*- coding: utf8 -*-
import os

base_dir = os.path.dirname(os.path.abspath(__file__))
#输入需要修改的文件夹名。
doc_name = 'demo-docs'
doc_path = os.path.join(base_dir, doc_name)
#输入需要插入的js代码。
js_doc_name = 'append_js.html'
js_doc_path = os.path.join(base_dir, js_doc_name)

walk_path_info = os.walk(doc_path)

html_file_num = 0
html_file_list = []
add_js_code = ''
for file_info in walk_path_info:
    if len(file_info[2]) > 0:
        for file_name in file_info[2]:
            file_name_structure = file_name.split('.')
            if 'html' in  file_name_structure:
                html_file_num += 1
                html_file = []
                html_file.append(file_info[0])
                html_file.append(file_name)
                html_file_list.append(html_file)
            else:
                continue
    else:
        continue

print "html_file_num:", html_file_num
print "html_file_list_len:", len(html_file_list)

file_js_obj = open(js_doc_path, 'r')
add_js_code = file_js_obj.read()
file_js_obj.close()

#print 'add_js_code:', add_js_code

html_file_has_head_num = 0

for html_file in html_file_list:
    html_file_path = os.path.join(html_file[0], html_file[1])
    file_obj = open(html_file_path, 'r')
    file_content = file_obj.read()
    #print file_content
    has_head = False
    '''
    文件对象提供了三个“读”方法： .read()、.readline() 和 .readlines()。
    .readline() 和 .readlines() 之间的差异是后者一次读取整个文件，象
    .read() 一样。.readlines() 自动将文件内容分析成一个行的列表，该列
    表可以由 Python 的 for ... in ... 结构进行处理。另一方面，.readline()
    每次只读取一行，通常比 .readlines() 慢得多。仅当没有足够内存可以
    一次读取整个文件时，才应该使用 .readline()。
    因为file_obj.read()，已把file_obj转化成字符串，所以下面的循环失效。
    下面的方法是从py2.5之后才引进的，效率远高于readline和readlines。
    for i in file_obj:
        if '</head>' in i:
            has_head = True
            break
        else:
            continue
    '''
    if '</head>' in file_content:
        has_head = True
    if has_head:
        html_file_has_head_num += 1
        position = file_content.find('</head>')
        file_new_content = file_content[:position] + '\n' + add_js_code + '\n' +file_content[position:]
        add_file_obj = open(html_file_path, 'w')
        add_file_obj.write(file_new_content)
        add_file_obj.close()
    else:
        continue
    file_obj.close()

print 'html_file_has_head_num:', html_file_has_head_num

had_add_js_file_num = 0

for html_file in html_file_list:
    html_file_path = os.path.join(html_file[0], html_file[1])
    file_obj = open(html_file_path, 'r')
    file_content = file_obj.read()
    if add_js_code in file_content:
        had_add_js_file_num += 1
    file_obj.close()

print 'had_add_js_file_num', had_add_js_file_num
