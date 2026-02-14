// File Upload Preview
const fileInput = document.getElementById('image');
const fileNameDisplay = document.querySelector('.file-name');
const imagePreview = document.getElementById('imagePreview');

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        fileNameDisplay.textContent = file.name;

        // Show image preview
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            imagePreview.classList.add('show');
        };
        reader.readAsDataURL(file);
    } else {
        fileNameDisplay.textContent = 'No file chosen';
        imagePreview.classList.remove('show');
        imagePreview.innerHTML = '';
    }
});

// Form Submission
const form = document.getElementById('addMovieForm');
const messageDiv = document.getElementById('message');

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(form);

    try {
        const response = await fetch('/api/movies/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showMessage('Content added successfully!', 'success');
            form.reset();
            fileNameDisplay.textContent = 'No file chosen';
            imagePreview.classList.remove('show');
            imagePreview.innerHTML = '';

            // Reload content
            loadAllContent();
            loadRecentAdditions();
        } else {
            showMessage(result.message || 'Error adding content', 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
});

// Show Message
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = 'message ' + type + ' show';

    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 5000);
}

// Load All Content
async function loadAllContent(filter = 'ALL') {
    try {
        const response = await fetch('/api/movies');
        const movies = await response.json();

        const tbody = document.getElementById('contentTableBody');
        tbody.innerHTML = '';

        const filtered = filter === 'ALL' ? movies : movies.filter(m => m.category === filter);

        filtered.forEach(movie => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${movie.image}" alt="${movie.title}" class="table-poster"></td>
                <td><strong>${movie.title}</strong></td>
                <td><span class="category-badge ${getCategoryClass(movie.category)}">${formatCategory(movie.category)}</span></td>
                <td><div class="table-description">${movie.description || 'No description'}</div></td>
                <td><div class="table-date">${formatDate(movie.createdAt)}</div></td>
                <td><button class="btn-delete" onclick="deleteMovie(${movie.id})">Delete</button></td>
            `;
            tbody.appendChild(row);
        });

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #64748B;">No content found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Delete Movie
async function deleteMovie(id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }

    try {
        const response = await fetch(`/api/movies/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showMessage('Content deleted successfully', 'success');
            loadAllContent();
            loadRecentAdditions();
        } else {
            showMessage(result.message || 'Error deleting content', 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

// Load Recent Additions
async function loadRecentAdditions() {
    try {
        const response = await fetch('/api/movies');
        const movies = await response.json();

        const recentList = document.getElementById('recentList');
        recentList.innerHTML = '';

        const recent = movies.slice(0, 5);

        recent.forEach(movie => {
            const item = document.createElement('div');
            item.className = 'recent-item';
            item.innerHTML = `
                <img src="${movie.image}" alt="${movie.title}" class="recent-item-image">
                <div class="recent-item-info">
                    <div class="recent-item-title">${movie.title}</div>
                    <div class="recent-item-category">${formatCategory(movie.category)}</div>
                    <div class="recent-item-time">${formatDate(movie.createdAt)}</div>
                </div>
            `;
            recentList.appendChild(item);
        });

        if (recent.length === 0) {
            recentList.innerHTML = '<p style="color: #64748B; text-align: center; padding: 20px;">No recent additions</p>';
        }
    } catch (error) {
        console.error('Error loading recent additions:', error);
    }
}

// Filter Tabs
const filterTabs = document.querySelectorAll('.filter-tab');
filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        filterTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');
        loadAllContent(filter);
    });
});

// Helper Functions
function getCategoryClass(category) {
    if (category === 'MOVIE') return 'movie';
    if (category === 'STAGE_DRAMA') return 'stage-drama';
    if (category === 'MUSICAL') return 'musical';
    return '';
}

function formatCategory(category) {
    if (category === 'MOVIE') return 'Movie';
    if (category === 'STAGE_DRAMA') return 'Stage Drama';
    if (category === 'MUSICAL') return 'Musical';
    return category;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return minutes + ' minutes ago';
    if (hours < 24) return hours + ' hours ago';
    if (days < 7) return days + ' days ago';

    return date.toLocaleDateString();
}

// Load content on page load
document.addEventListener('DOMContentLoaded', function() {
    loadAllContent();
    loadRecentAdditions();
});