import re
import sys

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

marker = '<script type="text/babel">'
idx = html.find(marker)
if idx == -1:
    print("Could not find babel tag")
    sys.exit(1)

end_idx = html.find('</script>', idx)
code = html[idx + len(marker):end_idx]

with open('extracted_script.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Extracted code lines:", len(code.splitlines()), "total bytes:", len(code))
