#!/usr/bin/env python3
"""
Compress all photos in the photos directory to optimize web loading
This script will resize images and reduce quality while maintaining visual appeal
"""

import os
from pathlib import Path
from PIL import Image
import sys

def compress_image(image_path, max_size=1200, quality=85):
    """
    Compress a single image
    - max_size: maximum width/height in pixels (1200px is good for web)
    - quality: JPEG quality (85 is a good balance)
    """
    try:
        with Image.open(image_path) as img:
            # Convert RGBA to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background

            # Get original size
            original_size = os.path.getsize(image_path)

            # Resize if image is larger than max_size
            if max(img.size) > max_size:
                img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)

            # Save with compression
            img.save(image_path, 'JPEG', quality=quality, optimize=True)

            # Get new size
            new_size = os.path.getsize(image_path)
            reduction = ((original_size - new_size) / original_size) * 100

            return original_size, new_size, reduction
    except Exception as e:
        print(f"Error compressing {image_path}: {e}")
        return None, None, 0

def compress_all_photos():
    """Compress all photos in the photos directory"""
    photos_dir = Path("photos")

    if not photos_dir.exists():
        print("Error: photos directory not found!")
        return

    # Supported image extensions
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}

    total_original = 0
    total_compressed = 0
    count = 0

    print("Starting photo compression...")
    print("=" * 60)

    # Process all images in all category folders
    for image_file in photos_dir.rglob('*'):
        if image_file.is_file() and image_file.suffix.lower() in image_extensions:
            print(f"\nCompressing: {image_file.name}")

            original, compressed, reduction = compress_image(image_file)

            if original and compressed:
                total_original += original
                total_compressed += compressed
                count += 1

                print(f"  Original: {original / 1024:.1f} KB")
                print(f"  Compressed: {compressed / 1024:.1f} KB")
                print(f"  Reduction: {reduction:.1f}%")

    print("\n" + "=" * 60)
    print(f"\n✅ Compression complete!")
    print(f"Total photos processed: {count}")
    print(f"Total original size: {total_original / (1024 * 1024):.2f} MB")
    print(f"Total compressed size: {total_compressed / (1024 * 1024):.2f} MB")
    print(f"Total space saved: {(total_original - total_compressed) / (1024 * 1024):.2f} MB")
    print(f"Overall reduction: {((total_original - total_compressed) / total_original) * 100:.1f}%")

if __name__ == "__main__":
    # Check if PIL is installed
    try:
        from PIL import Image
    except ImportError:
        print("Error: Pillow library not installed!")
        print("Please install it with: pip3 install Pillow")
        sys.exit(1)

    compress_all_photos()
