import http.server, functools, os, urllib.request, time, threading
from server import PulseCXRequestHandler, DIRECTORY, PORT

handler = functools.partial(PulseCXRequestHandler, directory=DIRECTORY)
http.server.HTTPServer.allow_reuse_address = True
httpd = http.server.HTTPServer(('0.0.0.0', 8080), handler)

t = threading.Thread(target=httpd.serve_forever, daemon=True)
t.start()
time.sleep(0.5)

for url in ['http://127.0.0.1:8080/', 'http://localhost:8080/', 'http://127.0.0.1:8080/admin', 'http://127.0.0.1:8080/api/tracker']:
    res = urllib.request.urlopen(url)
    print(f"{url} -> STATUS: {res.status}, BYTES: {len(res.read())}")

httpd.shutdown()
