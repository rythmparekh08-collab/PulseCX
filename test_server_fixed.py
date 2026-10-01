import http.server, socketserver, functools, os, urllib.request, time, threading

DIR = os.path.dirname(os.path.abspath(__file__))

class TestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path in ['/', '/index.html']:
            content = b"<html><body>Hello Test</body></html>"
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            return
        return super().do_GET()

handler = functools.partial(TestHandler, directory=DIR)
socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(('127.0.0.1', 8089), handler)

t = threading.Thread(target=httpd.serve_forever, daemon=True)
t.start()
time.sleep(0.5)

res = urllib.request.urlopen('http://127.0.0.1:8089/')
print("TEST SUCCESS! Status:", res.status, "Content:", res.read())
httpd.shutdown()
