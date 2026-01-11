// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Force hide lightbox immediately
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.add('hidden');
        lightbox.style.display = 'none';
    }

    loadGallery();
    setupFilters();
    setupLightbox();
});

// Load and render the photo gallery
async function loadGallery() {
    console.log('Loading gallery...');
    try {
        const response = await fetch('photos.json');
        console.log('Fetched photos.json, status:', response.status);
        const data = await response.json();
        console.log('Photos data:', data);
        renderGallery(data);
    } catch (error) {
        console.error('Error loading photos:', error);
        document.getElementById('gallery').innerHTML =
            '<p style="text-align: center; color: #666; padding: 2rem;">No photos to display yet. Add photos to get started!</p>';
    }
}

// Render gallery from JSON data
function renderGallery(data) {
    console.log('Rendering gallery with data:', data);
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Clear existing content

    // Loop through each category
    for (const [category, filenames] of Object.entries(data)) {
        console.log(`Processing category: ${category}, files:`, filenames);
        filenames.forEach(filename => {
            console.log(`Creating card for: ${filename}`);
            const photoCard = createPhotoCard(filename, category);
            gallery.appendChild(photoCard);
        });
    }

    // If no photos exist
    if (gallery.children.length === 0) {
        gallery.innerHTML =
            '<p style="text-align: center; color: #666; padding: 2rem; grid-column: 1 / -1;">No photos to display yet. Add photos to get started!</p>';
    }
    console.log('Gallery render complete. Total cards:', gallery.children.length);
}

// Create a photo card element
function createPhotoCard(filename, category) {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.dataset.category = category;

    // Extract dish name from filename (remove extension)
    const dishName = filename.replace(/\.[^/.]+$/, '');

    // Create image element
    const img = document.createElement('img');
    img.src = `photos/${category}/${filename}`;
    img.alt = dishName;
    img.loading = 'lazy'; // Lazy load images for better performance

    // Handle image load errors
    img.onerror = () => {
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="250" height="250"%3E%3Crect fill="%23f0f0f0" width="250" height="250"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial" font-size="14"%3EImage not found%3C/text%3E%3C/svg%3E';
        console.warn(`Image not found: photos/${category}/${filename}`);
    };

    // Create caption
    const caption = document.createElement('div');
    caption.className = 'photo-caption';

    const title = document.createElement('h3');
    title.textContent = dishName;

    const categoryLabel = document.createElement('p');
    categoryLabel.className = 'photo-category';
    categoryLabel.textContent = category;

    caption.appendChild(title);
    caption.appendChild(categoryLabel);

    // Assemble card
    card.appendChild(img);
    card.appendChild(caption);

    // Add click handler to open lightbox
    card.addEventListener('click', () => {
        openLightbox(img.src, dishName);
    });

    return card;
}

// Setup category filter dropdown
function setupFilters() {
    const categoryDropdown = document.getElementById('category-select');

    if (categoryDropdown) {
        categoryDropdown.addEventListener('change', (e) => {
            // Get selected category from dropdown value
            const selectedCategory = e.target.value;

            // Filter photos
            filterPhotos(selectedCategory);
        });
    }
}

// Filter photos by category
function filterPhotos(category) {
    const photoCards = document.querySelectorAll('.photo-card');

    photoCards.forEach(card => {
        if (category === 'all') {
            card.classList.remove('hidden');
        } else {
            if (card.dataset.category === category) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        }
    });
}

// Setup lightbox functionality
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.getElementById('close-lightbox');

    // Make sure lightbox is hidden on page load
    lightbox.classList.add('hidden');
    lightbox.style.display = 'none';

    // Close lightbox on X button click
    closeBtn.addEventListener('click', (e) => {
        console.log('Close button clicked');
        e.preventDefault();
        e.stopPropagation();
        closeLightbox();
    });

    // Close lightbox on clicking outside the image
    lightbox.addEventListener('click', (e) => {
        console.log('Lightbox clicked', e.target);
        if (e.target === lightbox || e.target.classList.contains('close-btn')) {
            closeLightbox();
        }
    });

    // Close lightbox on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
            console.log('Escape pressed');
            closeLightbox();
        }
    });
}

// Open lightbox with image
function openLightbox(imageSrc, dishName) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    lightboxImg.src = imageSrc;
    lightboxImg.alt = dishName;
    lightboxCaption.textContent = dishName;

    lightbox.classList.remove('hidden');
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close lightbox
function closeLightbox() {
    console.log('Closing lightbox...');
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.add('hidden');
    lightbox.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
    console.log('Lightbox closed');
}
