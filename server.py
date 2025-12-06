#!/usr/bin/env python3
"""
Simple HTTP server to run the OVO Team Visualization app.
Run this script and open http://localhost:8000 in your browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers to allow loading JSON files
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    Handler = MyHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            url = f"http://localhost:{PORT}"
            print(f"Server starting at {url}")
            print(f"Opening browser...")
            print(f"Press Ctrl+C to stop the server")
            
            # Try to open browser automatically
            try:
                webbrowser.open(url)
            except:
                pass
            
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"Error: Port {PORT} is already in use.")
            print(f"Please close the application using that port or use a different port.")
            sys.exit(1)
        else:
            raise

if __name__ == "__main__":
    main()

