import urllib.request

urls = [
    "https://cdn.tailwindcss.com",
    "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js"
]

for u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=10)
        print(f"URL: {u} -> Status: {res.status}, Length: {len(res.read())}")
    except Exception as e:
        print(f"FAILED URL: {u} -> Error: {e}")
