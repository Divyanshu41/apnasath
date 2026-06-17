// Dashboard specific JavaScript

// Check authentication
if (!localStorage.getItem(STORAGE_KEYS.TOKEN)) {
    window.location.href = 'index.html';
}

let currentUser = null;
let societyData = null;

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', async () => {
    currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update user name
    document.getElementById('userName').textContent = currentUser.name;
    
    // Load dashboard data
    await loadDashboardData();
    await loadSocietyInfo();
    await loadMembers();
    
    // Show verification status message
    if (currentUser.verificationStatus === 'PENDING') {
        showAlert('Your account is pending verification by society secretary.', 'info');
    }
});

// Section Navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${sectionName}-section`).classList.add('active');
    
    // Add active to clicked menu item
    event.currentTarget.classList.add('active');
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        if (!currentUser.societyId) return;
        
        // Load help requests count
        const helpCountData = await apiCall(`/help-requests/society/${currentUser.societyId}/count/open`, 'GET');
        document.getElementById('totalHelps').textContent = helpCountData.count || '0';
        
        // Load available items count
        const itemsCountData = await apiCall(`/shared-items/society/${currentUser.societyId}/count/available`, 'GET');
        document.getElementById('totalItems').textContent = itemsCountData.count || '0';
        
        // Emergency count (mock for now)
        document.getElementById('emergencies').textContent = '0';
        
        // Load my help requests for activity
        const myRequests = await apiCall('/help-requests/my-requests', 'GET');
        const myItems = await apiCall('/shared-items/my-items', 'GET');
        
        // Show recent activity
        const activityList = document.getElementById('activityList');
        let activityHTML = '';
        
        // Add recent help requests
        if (myRequests && myRequests.length > 0) {
            myRequests.slice(0, 2).forEach(req => {
                const timeAgo = getTimeAgo(req.createdAt);
                activityHTML += `
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="fas fa-hands-helping"></i>
                        </div>
                        <div class="activity-content">
                            <h4>You requested: ${req.title}</h4>
                            <p>${timeAgo} • Status: ${req.status}</p>
                        </div>
                    </div>
                `;
            });
        }
        
        // Add recent shared items
        if (myItems && myItems.length > 0) {
            myItems.slice(0, 2).forEach(item => {
                const timeAgo = getTimeAgo(item.createdAt);
                activityHTML += `
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="fas fa-exchange-alt"></i>
                        </div>
                        <div class="activity-content">
                            <h4>You shared: ${item.itemName}</h4>
                            <p>${timeAgo} • Status: ${item.status}</p>
                        </div>
                    </div>
                `;
            });
        }
        
        if (activityHTML === '') {
            activityHTML = '<p style="text-align:center;color:#666;padding:20px;">No recent activity</p>';
        }
        
        activityList.innerHTML = activityHTML;
        
        // Load help requests list
        await loadHelpRequests();
        
        // Load shared items list
        await loadSharedItems();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showAlert('Failed to load dashboard data', 'error');
    }
}

// Helper function to calculate time ago
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
}

// Load Society Info
async function loadSocietyInfo() {
    try {
        if (!currentUser.societyId) return;
        
        // Fetch society details
        const society = await apiCall(`/society/${currentUser.societyId}`, 'GET');
        societyData = society;
        
        const societyInfo = document.getElementById('societyInfo');
        societyInfo.innerHTML = `
            <div class="info-row">
                <div class="info-label">Society Name:</div>
                <div class="info-value">${society.name}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Address:</div>
                <div class="info-value">${society.address}</div>
            </div>
            <div class="info-row">
                <div class="info-label">City:</div>
                <div class="info-value">${society.city}, ${society.state}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Pincode:</div>
                <div class="info-value">${society.pincode}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Total Flats:</div>
                <div class="info-value">${society.totalFlats || 'N/A'}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Total Blocks:</div>
                <div class="info-value">${society.totalBlocks || 'N/A'}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Registration Code:</div>
                <div class="info-value">${society.registrationCode}</div>
            </div>
        `;
        
        // Load profile
        const profileInfo = document.getElementById('profileInfo');
        profileInfo.innerHTML = `
            <h2>${currentUser.name}</h2>
            <p>${currentUser.email}</p>
        `;
        
        const profileDetails = document.getElementById('profileDetails');
        profileDetails.innerHTML = `
            <div class="info-row">
                <div class="info-label">Name:</div>
                <div class="info-value">${currentUser.name}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">${currentUser.email}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Phone:</div>
                <div class="info-value">${currentUser.phone}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Flat Number:</div>
                <div class="info-value">${currentUser.flatNumber}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Role:</div>
                <div class="info-value">${currentUser.role}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Verification Status:</div>
                <div class="info-value">
                    <span class="badge ${currentUser.verificationStatus === 'VERIFIED' ? 'badge-available' : 'badge-medium'}">
                        ${currentUser.verificationStatus}
                    </span>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading society info:', error);
        showAlert('Failed to load society information', 'error');
    }
}

// Load Members
async function loadMembers() {
    try {
        const membersList = document.getElementById('membersList');
        document.getElementById('totalMembers').textContent = '15';
        
        // Mock data - In production, this would be an API call
        const members = [
            { name: 'Rahul Sharma', flat: 'A-101', status: 'verified' },
            { name: 'Priya Patel', flat: 'B-205', status: 'verified' },
            { name: 'Amit Kumar', flat: 'C-301', status: 'pending' },
            { name: 'Neha Singh', flat: 'A-102', status: 'verified' },
            { name: 'Vikram Mehta', flat: 'B-206', status: 'verified' }
        ];
        
        membersList.innerHTML = members.map(member => `
            <div class="member-card">
                <div class="member-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="member-name">${member.name}</div>
                <div class="member-flat">Flat ${member.flat}</div>
                <span class="member-status status-${member.status}">
                    ${member.status === 'verified' ? 'Verified' : 'Pending'}
                </span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading members:', error);
        document.getElementById('membersList').innerHTML = '<p class="text-muted">Error loading members</p>';
    }
}

// Modal Functions
function showHelpRequestModal() {
    document.getElementById('helpRequestModal').classList.add('active');
}

function showItemSharingModal() {
    document.getElementById('itemSharingModal').classList.add('active');
}

function showEmergencyModal() {
    showAlert('Emergency Alert feature coming soon!', 'info');
}

// Submit Help Request
async function submitHelpRequest(event) {
    event.preventDefault();
    
    const button = event.target.querySelector('button[type="submit"]');
    const helpData = {
        title: document.getElementById('helpType').value,
        description: document.getElementById('helpDescription').value,
        category: document.getElementById('helpType').value.toUpperCase().replace(/\s+/g, '_'),
        priority: document.getElementById('helpUrgency').value.toUpperCase()
    };
    
    try {
        setLoading(button, true);
        
        const result = await apiCall('/help-requests', 'POST', helpData);
        
        showAlert('Help request submitted successfully!', 'success');
        closeModal('helpRequestModal');
        event.target.reset();
        
        // Reload help requests
        await loadDashboardData();
        
    } catch (error) {
        showAlert(error.message || 'Failed to submit help request', 'error');
    } finally {
        setLoading(button, false);
    }
}

// Submit Item Sharing
async function submitItemSharing(event) {
    event.preventDefault();
    
    const button = event.target.querySelector('button[type="submit"]');
    const itemData = {
        itemName: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value.toUpperCase().replace(/\s+/g, '_'),
        description: document.getElementById('itemDescription').value,
        availableFrom: new Date().toISOString(),
        availableUntil: document.getElementById('itemAvailability').value ? 
                        new Date(Date.now() + parseInt(document.getElementById('itemAvailability').value) * 24 * 60 * 60 * 1000).toISOString() : 
                        null
    };
    
    try {
        setLoading(button, true);
        
        const result = await apiCall('/shared-items', 'POST', itemData);
        
        showAlert('Item shared successfully!', 'success');
        closeModal('itemSharingModal');
        event.target.reset();
        
        // Reload items
        await loadDashboardData();
        
    } catch (error) {
        showAlert(error.message || 'Failed to share item', 'error');
    } finally {
        setLoading(button, false);
    }
}

// Load Help Requests
async function loadHelpRequests() {
    try {
        if (!currentUser.societyId) return;
        
        const requests = await apiCall(`/help-requests/society/${currentUser.societyId}`, 'GET');
        
        const helpRequestsList = document.getElementById('helpRequestsList');
        if (!helpRequestsList) return;
        
        if (requests && requests.length > 0) {
            helpRequestsList.innerHTML = requests.map(req => `
                <div class="help-card">
                    <div class="help-header">
                        <h4>${req.title}</h4>
                        <span class="badge badge-${req.priority.toLowerCase()}">${req.priority}</span>
                    </div>
                    <p>${req.description}</p>
                    <div class="help-footer">
                        <span><i class="fas fa-tag"></i> ${req.category}</span>
                        <span><i class="fas fa-clock"></i> ${getTimeAgo(req.createdAt)}</span>
                        <span class="status-${req.status.toLowerCase()}">${req.status}</span>
                    </div>
                </div>
            `).join('');
        } else {
            helpRequestsList.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No help requests found</p>';
        }
    } catch (error) {
        console.error('Error loading help requests:', error);
    }
}

// Load Shared Items
async function loadSharedItems() {
    try {
        if (!currentUser.societyId) return;
        
        const items = await apiCall(`/shared-items/society/${currentUser.societyId}/available`, 'GET');
        
        const itemsList = document.getElementById('sharedItemsList');
        if (!itemsList) return;
        
        if (items && items.length > 0) {
            itemsList.innerHTML = items.map(item => `
                <div class="item-card">
                    <div class="item-icon">
                        <i class="fas fa-box"></i>
                    </div>
                    <div class="item-details">
                        <h4>${item.itemName}</h4>
                        <p>${item.description || 'No description'}</p>
                        <div class="item-meta">
                            <span><i class="fas fa-tag"></i> ${item.category}</span>
                            <span class="badge badge-available">${item.status}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            itemsList.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No items shared yet</p>';
        }
    } catch (error) {
        console.error('Error loading shared items:', error);
    }
}

// Member Search
document.getElementById('memberSearch')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const memberCards = document.querySelectorAll('.member-card');
    
    memberCards.forEach(card => {
        const name = card.querySelector('.member-name').textContent.toLowerCase();
        const flat = card.querySelector('.member-flat').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || flat.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});
