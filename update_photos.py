#!/usr/bin/env python3
"""
Automatically scan the photos folder and generate photos.json
Run this script whenever you add new photos to update the gallery
"""

import os
import json
from pathlib import Path

def scan_photos():
    """Scan the photos directory and create photos.json"""
    photos_dir = Path("photos")
    photo_data = {}

    # Supported image extensions
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}

    # Check if photos directory exists
    if not photos_dir.exists():
        print(f"Error: {photos_dir} directory not found!")
        return

    # Scan each category folder
    categories = ['Chinese', 'Korean', 'Japanese', 'Western']

    for category in categories:
        category_path = photos_dir / category

        if not category_path.exists():
            print(f"Warning: {category} folder not found, skipping...")
            photo_data[category] = []
            continue

        # Get all image files in the category folder
        images = []
        for file in sorted(category_path.iterdir()):
            if file.is_file() and file.suffix.lower() in image_extensions:
                images.append(file.name)

        photo_data[category] = images
        print(f"Found {len(images)} photos in {category}")

    # Write to photos.json
    with open('photos.json', 'w', encoding='utf-8') as f:
        json.dump(photo_data, f, indent=2, ensure_ascii=False)

    total_photos = sum(len(photos) for photos in photo_data.values())
    print(f"\nSuccess! Generated photos.json with {total_photos} total photos")
    print("Refresh your browser to see the updated gallery")

if __name__ == "__main__":
    scan_photos()
