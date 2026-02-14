// Tab switching
const menuItems = document.querySelectorAll('.menu-item');
const tabContents = document.querySelectorAll('.tab-content');

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const tabId = item.getAttribute('data-tab');
        menuItems.forEach(m => m.classList.remove('active'));
        tabContents.forEach(t => t.classList.remove('active'));
        item.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Toggle edit mode
let isEditing = false;
function toggleEdit() {
    const inputs = document.querySelectorAll('#profileForm input');
    const editActions = document.getElementById('editActions');
    const editBtn = document.querySelector('.btn-edit');

    isEditing = !isEditing;
    inputs.forEach(i => i.disabled = !isEditing);

    if (isEditing) {
        editActions.style.display = 'flex';
        editBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
    } else {
        editActions.style.display = 'none';
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
    }
}

// Profile form submit
const profileForm = document.getElementById('profileForm');
if(profileForm) {
    profileForm.addEventListener('submit', async e => {
        e.preventDefault();

        const data = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value
        };

        try {
            const res = await fetch('/api/user/profile/update', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            if(res.ok){
                document.querySelector('.user-info h1').textContent = data.fullName;
                showNotification('Profile updated!', 'success');
                toggleEdit();
            } else {
                showNotification('Failed to update profile', 'error');
            }
        } catch(err){
            console.error(err);
            showNotification('Error updating profile', 'error');
        }
    });
}

// Avatar preview
const avatarInput = document.getElementById('avatarInput');
const profileAvatar = document.getElementById('profileAvatar');
avatarInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = e => profileAvatar.src = e.target.result;
    reader.readAsDataURL(file);
    showNotification('Avatar updated!', 'success');
});

// Notifications
function showNotification(msg, type){
    const note = document.createElement('div');
    note.className = 'notification';
    note.style.cssText = `
        position: fixed; top: 100px; right: 30px;
        background: ${type==='success'?'#22c55e':'#ef4444'};
        color: white; padding: 16px 24px;
        border-radius: 12px; z-index: 10000;
        display: flex; align-items: center; gap: 8px;
        animation: slideIn 0.3s ease-out;
    `;
    note.innerHTML = `<i class="fas ${type==='success'?'fa-check-circle':'fa-exclamation-circle'}"></i>${msg}`;
    document.body.appendChild(note);

    setTimeout(()=>{
        note.style.animation='slideOut 0.3s ease-out';
        setTimeout(()=>note.remove(),300);
    },3000);
}

// Notification animations
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn { from { transform: translateX(400px); opacity:0 } to { transform: translateX(0); opacity:1; } }
@keyframes slideOut { from { transform: translateX(0); opacity:1 } to { transform: translateX(400px); opacity:0; } }
`;
document.head.appendChild(style);