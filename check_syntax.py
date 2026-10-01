import re

with open('extracted_script.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines in extracted script: {len(lines)}")

# Check bracket balances
brace_count = 0
paren_count = 0
bracket_count = 0

for i, line in enumerate(lines, 1):
    # Ignore comments and template strings
    cleaned = re.sub(r'//.*', '', line)
    for ch in cleaned:
        if ch == '{': brace_count += 1
        elif ch == '}': brace_count -= 1
        elif ch == '(': paren_count += 1
        elif ch == ')': paren_count -= 1
        elif ch == '[': bracket_count += 1
        elif ch == ']': bracket_count -= 1

    if brace_count < 0:
        print(f"Negative brace count at line {i}")
    if paren_count < 0:
        print(f"Negative paren count at line {i}")

print(f"Final balance -> braces: {brace_count}, parens: {paren_count}, brackets: {bracket_count}")
