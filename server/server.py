import http.server
import socketserver

Port = 8888
Directory = "dist"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=Directory, **kwargs)

with socketserver.TCPServer(("", Port), Handler) as httpd:
    print(f"http://127.0.0.1:{Port}")
    httpd.serve_forever()
