with open('index.html', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's search for shipments in ProductTrackerPlatform
import re
match = re.search(r'function ProductTrackerPlatform\b.*?(?=function|\Z)', code, re.DOTALL)
if match:
    comp_code = match.group(0)
    print("Found ProductTrackerPlatform, length:", len(comp_code))
    for m in re.finditer(r'\bshipments\b', comp_code):
        start = max(0, m.start() - 40)
        end = min(len(comp_code), m.end() + 40)
        print("Reference to shipments:", comp_code[start:end].replace('\n', ' '))

# Check other components for free variables
components = re.findall(r'function ([A-Z][a-zA-Z0-9_]*)\s*\((.*?)\)\s*\{', code)
print("Components found:", components)
