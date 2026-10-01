import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's check the script tags
pattern = r'<script type="text/babel"[^>]*>(.*?)</script>'
scripts = re.findall(pattern, text, re.DOTALL)
print(f"Found {len(scripts)} text/babel script blocks")

for idx, s in enumerate(scripts):
    stack = []
    pairs = {'(': ')', '{': '}', '[': ']'}
    for i, ch in enumerate(s):
        if ch in '({[':
            stack.append((ch, i))
        elif ch in ')}]':
            if not stack:
                print(f"Script {idx}: Unmatched closing {ch} at pos {i}")
            else:
                top, pos = stack.pop()
                if pairs[top] != ch:
                    print(f"Script {idx}: Mismatch {top} at {pos} with {ch} at {i}")
    print(f"Script {idx} remaining unmatched count: {len(stack)}")

# Let's inspect the top and bottom of the babel scripts
print("Checking component definitions...")
components = re.findall(r'function ([A-Za-z0-9_]+)\s*\(', text)
print("Found components:", components)

# Check ReactDOM.render / createRoot
if "ReactDOM.createRoot" in text:
    print("ReactDOM.createRoot found")
else:
    print("WARNING: ReactDOM.createRoot NOT found!")
