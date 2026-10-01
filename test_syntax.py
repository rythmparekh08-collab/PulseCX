import urllib.request
import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Check babel script
start_tag = '<script type="text/babel">'
end_tag = '</script>'
start_idx = html.find(start_tag)
end_idx = html.rfind(end_tag)

if start_idx != -1 and end_idx != -1:
    code = html[start_idx + len(start_tag):end_idx]
    print("Found JSX code, length:", len(code))
    curlies = code.count('{') - code.count('}')
    parens = code.count('(') - code.count(')')
    squares = code.count('[') - code.count(']')
    print(f"Index Balance: curlies={curlies}, parens={parens}, squares={squares}")
else:
    print("Could not find babel tags in index.html")

with open('admin.html', 'r', encoding='utf-8') as f:
    admin_html = f.read()

start_idx = admin_html.find(start_tag)
end_idx = admin_html.rfind(end_tag)
if start_idx != -1 and end_idx != -1:
    code = admin_html[start_idx + len(start_tag):end_idx]
    print("Found admin JSX code, length:", len(code))
    curlies = code.count('{') - code.count('}')
    parens = code.count('(') - code.count(')')
    squares = code.count('[') - code.count(']')
    print(f"Admin Balance: curlies={curlies}, parens={parens}, squares={squares}")
