with open('index.html', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's check ServiceManagerDeskPlatform
import re
comps = ['ServiceManagerDeskPlatform', 'CustomerLoginPlatform', 'CustomerAuthModalBox', 'PaymentTrackerPlatform', 'PolicySection', 'ChatWidgetBox']

for comp_name in comps:
    m = re.search(r'function ' + comp_name + r'\b.*?(?=function [A-Z]|\Z)', code, re.DOTALL)
    if m:
        c_code = m.group(0)
        print(f"--- Checking {comp_name} (len: {len(c_code)}) ---")
        # Check common missed variables
        for var in ['shipments', 'refunds', 'payments', 'customer', 'activeTab', 'selectedInvoice', 'isAuthOpen']:
            # Count usages vs declarations
            usages = len(re.findall(r'\b' + var + r'\b', c_code))
            decl = len(re.findall(r'(?:const|let|var)\s+\[?\b' + var + r'\b|(?:function\s+\w+\s*\([^)]*\b' + var + r'\b)', c_code))
            if usages > 0 and decl == 0:
                print(f"  POTENTIAL UNDECLARED: '{var}' used {usages} times, declared {decl} times")
