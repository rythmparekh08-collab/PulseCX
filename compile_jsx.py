import re

# Simple JSX transformer for React 18 in Python
# Converts <Tag attr="val">children</Tag> to React.createElement(Tag, {attr: "val"}, children)
# Or let's see how much code is in index.html and admin.html.

with open('admin.html', 'r', encoding='utf-8') as f:
    admin_code = f.read()

print("Admin code length:", len(admin_code))
