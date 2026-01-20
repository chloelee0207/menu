// ============================================
// ARTISAN MARKET STALL - Interactive Gallery
// ============================================

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
    try {
        const response = await fetch('photos.json');
        const data = await response.json();
        renderGallery(data);
    } catch (error) {
        console.error('Error loading photos:', error);
        document.getElementById('gallery').innerHTML =
            `<p style="text-align: center; color: var(--text-muted); padding: 2rem; grid-column: 1 / -1;">
                No photos to display yet. Add photos to get started!
            </p>`;
    }
}

// Generate a random rotation within a range
function getRandomRotation(min = -3, max = 3) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

// Generate a random animation delay for staggered entrance
function getStaggerDelay(index, baseDelay = 0.05) {
    return (index * baseDelay).toFixed(2);
}

// Render gallery from JSON data
function renderGallery(data) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Clear existing content

    let cardIndex = 0;

    // Loop through each category
    for (const [category, filenames] of Object.entries(data)) {
        filenames.forEach(filename => {
            const photoCard = createPhotoCard(filename, category, cardIndex);
            gallery.appendChild(photoCard);
            cardIndex++;
        });
    }

    // If no photos exist
    if (gallery.children.length === 0) {
        gallery.innerHTML =
            `<p style="text-align: center; color: var(--text-muted); padding: 2rem; grid-column: 1 / -1;">
                No photos to display yet. Add photos to get started!
            </p>`;
    }
}

// Create a photo card element with organic styling
function createPhotoCard(filename, category, index) {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.dataset.category = category;

    // Apply organic rotation (scattered polaroid effect)
    const rotation = getRandomRotation(-4, 4);
    card.style.setProperty('--rotation', `${rotation}deg`);

    // Apply random tape rotation
    const tapeRotation = getRandomRotation(-8, 8);
    card.style.setProperty('--tape-rotation', `${tapeRotation}deg`);

    // Apply staggered animation delay
    const delay = getStaggerDelay(index, 0.06);
    card.style.animationDelay = `${delay}s`;

    // Extract dish name from filename (remove extension)
    const dishName = filename.replace(/\.[^/.]+$/, '');

    // Create image element
    const img = document.createElement('img');
    img.src = `photos/${category}/${filename}`;
    img.alt = dishName;
    img.loading = 'lazy'; // Lazy load images for better performance

    // Handle image load errors
    img.onerror = () => {
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="250" height="250"%3E%3Crect fill="%23f5e6d3" width="250" height="250"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b5d4d" font-family="Outfit, sans-serif" font-size="14"%3EPhoto coming soon%3C/text%3E%3C/svg%3E';
    };

    // Create caption container
    const caption = document.createElement('div');
    caption.className = 'photo-caption';

    // Create title
    const title = document.createElement('h3');
    title.textContent = dishName;

    // Create category badge with slight rotation
    const categoryLabel = document.createElement('p');
    categoryLabel.className = 'photo-category';
    categoryLabel.textContent = category;

    // Apply random badge rotation
    const badgeRotation = getRandomRotation(-4, 4);
    categoryLabel.style.setProperty('--badge-rotation', `${badgeRotation}deg`);

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
            const selectedCategory = e.target.value;
            filterPhotos(selectedCategory);
        });
    }
}

// Filter photos by category with animation
function filterPhotos(category) {
    const photoCards = document.querySelectorAll('.photo-card');
    let visibleIndex = 0;

    photoCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.classList.remove('hidden');

            // Re-trigger entrance animation with new stagger
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow
            card.style.animation = null;
            card.style.animationDelay = `${getStaggerDelay(visibleIndex, 0.04)}s`;

            visibleIndex++;
        } else {
            card.classList.add('hidden');
        }
    });
}

// Setup lightbox functionality
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.getElementById('close-lightbox');
    const lightboxFrame = document.querySelector('.lightbox-frame');

    // Make sure lightbox is hidden on page load
    lightbox.classList.add('hidden');
    lightbox.style.display = 'none';

    // Close lightbox on X button click
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeLightbox();
    });

    // Close lightbox on clicking outside the frame
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Prevent clicks on the frame from closing
    if (lightboxFrame) {
        lightboxFrame.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Close lightbox on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
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
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.add('hidden');
    lightbox.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
}
