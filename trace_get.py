import traceback, sys
from server import PulseCXRequestHandler

# Let's inspect do_GET source or mock self
import urllib.parse

class MockSelf:
    def __init__(self, path):
        self.path = path
        self.headers = {}
    def send_response(self, code):
        print("send_response:", code)
    def send_header(self, k, v):
        print("send_header:", k, v)
    def end_headers(self):
        print("end_headers")
    class MockWFile:
        def write(self, data):
            print("wrote bytes:", len(data))
    wfile = MockWFile()

try:
    m = MockSelf('/')
    PulseCXRequestHandler.do_GET(m)
    print("MOCK SUCCESS!")
except Exception as e:
    traceback.print_exc()
