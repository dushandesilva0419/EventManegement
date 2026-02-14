// EVENTS PAGE JAVASCRIPT - WITH IMAGE UPLOAD FIX

let events = [];
let currentEditingId = null;

// Load events from database
function loadEvents() {
    fetch("/api/events")
        .then(res => res.json())
        .then(data => {
            events = data;
            renderEvents();
        })
        .catch(err => {
            console.error("Failed to load events:", err);
            showNotification("Failed to load events", "error");
        });
}

// Open add modal
function openAddEventModal() {
    currentEditingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Event';
    document.getElementById('eventForm').reset();
    document.getElementById('eventModal').classList.add('active');
}

// Open edit modal
function editEvent(id) {
    currentEditingId = id;
    const event = events.find(e => e.id === id);
    if (!event) return;

    document.getElementById('modalTitle').textContent = 'Edit Event';

    const form = document.getElementById('eventForm');
    form.elements['title'].value = event.title;
    form.elements['category'].value = getCategoryValue(event.category);
    form.elements['description'].value = event.description;
    form.elements['location'].value = event.location;

    // Fix datetime format
    if (event.datetime) {
        const dateStr = event.datetime.substring(0, 16);
        form.elements['datetime'].value = dateStr;
    }

    form.elements['totalTickets'].value = event.totalTickets;
    form.elements['price'].value = event.price;

    document.getElementById('eventModal').classList.add('active');
}

// Close modal
function closeEventModal() {
    document.getElementById('eventModal').classList.remove('active');
    document.getElementById('eventForm').reset();
    currentEditingId = null;
}

// Category helpers
function getCategoryValue(categoryName) {
    const map = {
        'Outdoor & Adventure': 'outdoor',
        'Food & Culinary': 'food',
        'Music': 'music',
        'Fashion': 'fashion',
        'Art & Design': 'art',
        'Technology': 'tech'
    };
    return map[categoryName] || categoryName;
}

function getCategoryName(categoryValue) {
    const map = {
        'outdoor': 'Outdoor & Adventure',
        'food': 'Food & Culinary',
        'music': 'Music',
        'fashion': 'Fashion',
        'art': 'Art & Design',
        'tech': 'Technology'
    };
    return map[categoryValue] || categoryValue;
}

// SAVE EVENT WITH IMAGE UPLOAD
async function saveEvent(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const imageFile = formData.get('image');

    const eventData = {
        title: formData.get('title'),
        category: getCategoryName(formData.get('category')),
        description: formData.get('description'),
        location: formData.get('location'),
        datetime: formData.get('datetime'),
        totalTickets: parseInt(formData.get('totalTickets')),
        price: parseFloat(formData.get('price'))
    };

    try {
        // Step 1: Save event
        const saveUrl = currentEditingId ? `/api/events/${currentEditingId}` : "/api/events";
        const saveMethod = currentEditingId ? "PUT" : "POST";

        const saveResponse = await fetch(saveUrl, {
            method: saveMethod,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventData)
        });

        if (!saveResponse.ok) {
            throw new Error('Failed to save event');
        }

        const savedEvent = await saveResponse.json();

        // Step 2: Upload image if provided
        if (imageFile && imageFile.size > 0) {
            const imageFormData = new FormData();
            imageFormData.append('image', imageFile);

            const uploadResponse = await fetch(`/api/events/${savedEvent.id}/upload-image`, {
                method: "POST",
                body: imageFormData
            });

            if (!uploadResponse.ok) {
                console.error('Image upload failed');
                showNotification("Event saved but image upload failed", "warning");
            }
        }

        showNotification(
            currentEditingId ? "Event updated successfully!" : "Event created successfully!",
            "success"
        );

        closeEventModal();
        loadEvents();

    } catch (error) {
        console.error('Error:', error);
        showNotification("Failed to save event", "error");
    }
}

// Delete event
function deleteEvent(id) {
    if (!confirm("Are you sure you want to delete this event?")) return;

    fetch(`/api/events/${id}`, { method: "DELETE" })
        .then(() => {
            showNotification("Event deleted successfully!", "success");
            loadEvents();
        })
        .catch(() => {
            showNotification("Failed to delete event", "error");
        });
}

// Render events
function renderEvents() {
    const container = document.getElementById('eventsList');
    if (!container) return;

    if (events.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #71717a;">
                <h3 style="font-size: 18px; margin-bottom: 8px;">No events found</h3>
                <p style="font-size: 14px;">Click "Add Event" to create your first event.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = events.map(event => {
        const ticketsLeft = event.totalTickets - (event.soldTickets || 0);
        const percentage = Math.round(((event.soldTickets || 0) / event.totalTickets) * 100) || 0;
        const formattedDate = formatDateTime(event.datetime);

        // Use event.image if exists, otherwise placeholder
        const imageUrl = event.image || '/images/event-placeholder.jpg';

        return `
            <div class="event-item">
                <div class="event-image">
                    <img src="${imageUrl}" alt="${event.title}"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect fill=%22%23a855f7%22 width=%22150%22 height=%22150%22/%3E%3C/svg%3E'">
                    <span class="event-category">${event.category}</span>
                </div>
                <div class="event-content">
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-description">${event.description}</p>
                    <div class="event-meta">
                        <div class="meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            ${event.location}
                        </div>
                        <div class="meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            ${formattedDate}
                        </div>
                    </div>
                </div>
                <div class="event-stats">
                    <div class="progress-section">
                        <div class="progress-header">
                            <span class="progress-label">${percentage}% Ticket Sold</span>
                            <div class="ticket-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                </svg>
                            </div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                    <div class="event-details">
                        <span class="tickets-left">${ticketsLeft} Tickets Left</span>
                        <span class="event-price">$${event.price}</span>
                    </div>
                </div>
                <div class="event-actions">
                    <button class="action-btn edit-btn" onclick="editEvent(${event.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteEvent(${event.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Format datetime
function formatDateTime(datetime) {
    const date = new Date(datetime);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const dateStr = date.toLocaleDateString('en-US', options);
    const timeStr = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    return `${dateStr} - ${timeStr}`;
}

// Show notification
function showNotification(message, type = 'info') {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };

    const note = document.createElement('div');
    note.textContent = message;
    note.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 16px 24px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(note);

    setTimeout(() => {
        note.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => note.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadEvents();

    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.addEventListener('click', e => {
            if (e.target === modal) closeEventModal();
        });
    }
});

// ESC key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeEventModal();
});