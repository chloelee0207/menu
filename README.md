# C&JS Home-cooked Food Gallery

A beautiful food photo gallery website to showcase your home-cooked meals!

## 🍳 How to Add New Photos

### Super Simple 1-Step Process:

**Just Add Photo to Category Folder - That's It!**
- Download your food photo
- Name it with the dish name (e.g., "Beef Noodle Soup.jpg")
- Save to the correct folder:
  - Chinese dishes → `photos/Chinese/`
  - Korean dishes → `photos/Korean/`
  - Japanese dishes → `photos/Japanese/`
  - Western dishes → `photos/Western/`
- **Refresh your browser** - your new photo automatically appears!

No scripts to run, no JSON files to edit. Just add the photo and refresh! ✨

## 🚀 Running the Website

### Start the Local Server:
```bash
cd /Users/chloelee/code/claude/menu
python3 server.py
```

Then open your browser to: `http://localhost:8000`

The server automatically scans your photo folders every time you refresh the page!

## 📁 Folder Structure

```
menu/
├── index.html          - Main webpage
├── style.css           - Styling
├── script.js           - Interactive features
├── server.py           - Smart server that auto-scans photos
└── photos/
    ├── Chinese/        - Chinese food photos
    ├── Korean/         - Korean food photos
    ├── Japanese/       - Japanese food photos
    └── Western/        - Western food photos
```

## ✨ Features

- **2-Column Grid Layout** with rounded corners
- **Category Filtering** - Filter by All, Chinese, Korean, Japanese, or Western
- **Click to Enlarge** - Click any photo to view full-size
- **Automatic Updates** - Just add photos and run the script
- **Mobile Responsive** - Works beautifully on phones and tablets
- **Beautiful Design** - Warm brown/copper color scheme

## 🎨 Tips for Best Results

- Use square photos (or they'll be cropped to square)
- Name files descriptively (filename becomes the dish name)
- Keep file sizes reasonable (under 500KB)
- Supported formats: JPG, PNG, GIF, WebP

Enjoy your food gallery! 🍜
