import http.server, socketserver, functools, urllib.request, os, traceback
from server import PulseCXRequestHandler, DIRECTORY

try:
    handler = functools.partial(PulseCXRequestHandler, directory=DIRECTORY)
    http.server.HTTPServer.allow_reuse_address = True
    server = http.server.HTTPServer(('127.0.0.1', 8085), handler)
    print("Server created on 8085. Handling 1 request...")

    import threading, time
    t = threading.Thread(target=server.handle_request)
    t.start()
    time.sleep(0.2)

    res = urllib.request.urlopen('http://127.0.0.1:8085/')
    print("SUCCESS 8085: Status:", res.status, "Bytes:", len(res.read()))
    server.server_close()
except Exception as e:
    traceback.print_exc()
