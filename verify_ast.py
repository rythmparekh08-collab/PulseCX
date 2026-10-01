import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract the script
start_tag = '<script type="text/babel">'
end_tag = '</script>'
start_idx = html.find(start_tag)
end_idx = html.rfind(end_tag)

code = html[start_idx + len(start_tag):end_idx]

# List of global variables/functions available
globals_set = {
    'React', 'ReactDOM', 'useState', 'useEffect', 'useRef',
    'INITIAL_SHIPMENTS', 'DEFAULT_CUSTOMER', 'window', 'document',
    'fetch', 'setTimeout', 'setInterval', 'clearInterval', 'clearTimeout',
    'console', 'Math', 'Date', 'JSON', 'Blob', 'URL', 'App',
    'ProductTrackerPlatform', 'ServiceManagerDeskPlatform', 'CustomerLoginPlatform',
    'CustomerAuthModalBox', 'PaymentTrackerPlatform', 'PolicySection', 'ChatWidgetBox'
}

# Scan each component function body
func_matches = re.finditer(r'function\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)\s*\{', code)
funcs = list(func_matches)

for i in range(len(funcs)):
    f_name = funcs[i].group(1)
    f_params = [p.strip().split(':')[0].strip().split('=')[0].strip() for p in funcs[i].group(2).replace('{','').replace('}','').split(',') if p.strip()]
    f_start = funcs[i].end()
    f_end = funcs[i+1].start() if i + 1 < len(funcs) else len(code)
    f_body = code[f_start:f_end]
    
    # Collect locally declared vars
    local_vars = set(f_params)
    for m in re.finditer(r'\b(?:const|let|var)\s+([^=;\n]+)', f_body):
        decl = m.group(1)
        for var in re.findall(r'[a-zA-Z_$][a-zA-Z0-9_$]*', decl):
            local_vars.add(var)
    for m in re.finditer(r'\bfunction\s+([a-zA-Z_$][a-zA-Z0-9_$]*)', f_body):
        local_vars.add(m.group(1))
    
    # Also in arrow function params or .map / .filter / .find / catch
    for m in re.finditer(r'\.(?:map|filter|find|forEach|some|every)\s*\(\s*(?:\(?\s*([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*,\s*([a-zA-Z_$][a-zA-Z0-9_$]*))?\s*\)?|\(([^)]+)\))\s*=>', f_body):
        for g in m.groups():
            if g:
                for v in re.findall(r'[a-zA-Z_$][a-zA-Z0-9_$]*', g):
                    local_vars.add(v)
    for m in re.finditer(r'\bcatch\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\)', f_body):
        local_vars.add(m.group(1))

    # Now find all identifiers used in expressions
    # Filter out JSX tags, properties (after dot or before colon), string literals
    # Quick check for words used before .map or in conditions
    for m in re.finditer(r'([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\.\s*(?:map|filter|find|forEach|length|toLowerCase|trim|toUpperCase|slice)', f_body):
        var = m.group(1)
        if var not in local_vars and var not in globals_set:
            print(f"[{f_name}] Undefined variable before method: '{var}'")

    for m in re.finditer(r'\{([a-zA-Z_$][a-zA-Z0-9_$]*)\s*&&', f_body):
        var = m.group(1)
        if var not in local_vars and var not in globals_set:
            print(f"[{f_name}] Undefined variable in conditional: '{var}'")
