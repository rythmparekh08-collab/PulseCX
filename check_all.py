with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Check for unescaped characters in JSX
# For example, raw < or > or unclosed strings or comments
lines = content.split('\n')
for i, line in enumerate(lines, 1):
    # Check for invalid characters or unterminated template strings
    if 'undefined' in line and not ('typeof' in line or '===' in line):
        print(f"Line {i}: {line.strip()[:60]}")
    # Check if any style tag or script tag is malformed
    if '<script' in line and 'type="text/babel"' not in line and 'src=' not in line and '</script>' not in line and '<script>' not in line:
        print(f"Suspicious script line {i}: {line.strip()}")
