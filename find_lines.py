with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines, 1):
    # Check ServiceManagerDeskPlatform for shipments
    if 949 <= i <= 1300 and 'shipments' in line:
        print(f"ServiceManagerDeskPlatform line {i}: {line.strip()}")
    # Check PolicySection for customer
    if 3300 <= i <= 3370 and 'customer' in line:
        print(f"PolicySection line {i}: {line.strip()}")
    # Check ChatWidgetBox for shipments
    if 3370 <= i <= 3610 and 'shipments' in line:
        print(f"ChatWidgetBox line {i}: {line.strip()}")
