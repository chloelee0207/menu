#!/usr/bin/env python3
"""
Simple HTTP server that automatically generates photos.json on-the-fly
This eliminates the need to manually run update_photos.py
"""

import os
import json
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler

class PhotoGalleryHandler(SimpleHTTPRequestHandler):
    """Custom handler that auto-generates photos.json when requested"""

    def do_GET(self):
        # If requesting photos.json, generate it dynamically
        if self.path == '/photos.json':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()

            # Scan photos directory
            photos_data = self.scan_photos()
            json_data = json.dumps(photos_data, indent=2, ensure_ascii=False)
            self.wfile.write(json_data.encode('utf-8'))
        else:
            # For all other requests, use default handler
            super().do_GET()

    def scan_photos(self):
        """Scan the photos directory and return photo data"""
        photos_dir = Path("photos")
        photo_data = {}

        # Supported image extensions
        image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}

        # Scan each category folder (in alphabetical order)
        categories = ['Chinese', 'Desserts', 'Drinks', 'Fusion', 'Indian', 'Japanese', 'Korean', 'Western']

        for category in categories:
            category_path = photos_dir / category

            if not category_path.exists():
                photo_data[category] = []
                continue

            # Get all image files in the category folder
            images = []
            for file in sorted(category_path.iterdir()):
                if file.is_file() and file.suffix.lower() in image_extensions:
                    images.append(file.name)

            photo_data[category] = images

        return photo_data

def run_server(port=8000):
    """Start the HTTP server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, PhotoGalleryHandler)
    print(f'✨ Server started at http://localhost:{port}')
    print(f'📸 Photos are automatically updated when you refresh the page!')
    print(f'Press Ctrl+C to stop the server\n')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
