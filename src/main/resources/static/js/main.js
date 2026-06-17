// API Base URL - Change this to your backend URL
const API_BASE_URL = 'http://localhost:8080/api';

// Storage keys
const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'user_data'
};

// Utility Functions
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} show`;
    alert.textContent = message;
    
    // Insert at the top of the page
    document.body.insertBefore(alert, document.body.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

function setLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
    } else {
        button.disabled = false;
        button.classList.remove('loading');
    }
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function switchModal(closeModalId, openModalId) {
    closeModal(closeModalId);
    openModal(openModalId);
}

// Legacy functions for backward compatibility
function showLoginModal() {
    openModal('loginModal');
}

function showRegisterModal() {
    openModal('registerModal');
}

function switchToRegister() {
    switchModal('loginModal', 'registerModal');
}

function switchToLogin() {
    switchModal('registerModal', 'loginModal');
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// Smooth scroll
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Active nav link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// API Helper Functions
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    // Add auth token if exists
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add body for POST/PUT requests
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(responseData.message || 'Something went wrong!');
        }
        
        return responseData;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Login Handler
async function handleLogin(event) {
    event.preventDefault();
    
    const button = event.target.querySelector('button[type="submit"]');
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const loginData = {
        emailOrPhone: email,
        password: password
    };
    
    try {
        setLoading(button, true);
        
        const response = await apiCall('/auth/login', 'POST', loginData);
        
        // Save token and user data
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({
            id: response.userId,
            name: response.name,
            email: response.email,
            phone: response.phone || '',
            flatNumber: response.flatNumber || '',
            role: response.role,
            verificationStatus: response.verificationStatus,
            societyId: response.societyId
        }));
        
        showAlert('Login successful! Welcome back!', 'success');
        closeModal('loginModal');
        
        // Redirect to dashboard after 1 second
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        showAlert(error.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
        setLoading(button, false);
    }
}

// Register Handler
async function handleRegister(event) {
    event.preventDefault();
    console.log('Register form submitted');
    
    const button = event.target.querySelector('button[type="submit"]');
    
    // Get all form values
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    console.log('Password match check:', password === confirmPassword);
    
    // Validate password confirmation
    if (password !== confirmPassword) {
        showAlert('Passwords do not match!', 'error');
        return;
    }
    
    const registerData = {
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        phone: document.getElementById('registerPhone').value,
        password: password,
        flatNumber: document.getElementById('registerFlatNumber').value,
        societyCode: document.getElementById('registerSocietyCode').value
    };
    
    console.log('Register data:', registerData);
    
    try {
        setLoading(button, true);
        
        console.log('Calling API: /auth/signup');
        const response = await apiCall('/auth/signup', 'POST', registerData);
        console.log('API Response:', response);
        
        // Save token and user data
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({
            id: response.userId,
            name: response.name,
            email: response.email,
            phone: response.phone || '',
            flatNumber: response.flatNumber || '',
            role: response.role,
            verificationStatus: response.verificationStatus,
            societyId: response.societyId
        }));
        
        showAlert('Registration successful! Welcome to CommunityConnect!', 'success');
        closeModal('registerModal');
        
        // Redirect to dashboard after 1 second
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        showAlert(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
        setLoading(button, false);
    }
}

// Check if user is already logged in
function checkAuth() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    
    if (token && user) {
        // User is logged in, update UI
        const userData = JSON.parse(user);
        const navButtons = document.querySelector('.nav-buttons');
        
        navButtons.innerHTML = `
            <span style="margin-right: 1rem; color: var(--text);">
                Hi, ${userData.name}!
            </span>
            <button class="btn btn-primary" onclick="goToDashboard()">
                Dashboard
            </button>
            <button class="btn btn-outline" onclick="logout()">
                Logout
            </button>
        `;
    }
}

// Go to dashboard
function goToDashboard() {
    window.location.href = 'dashboard.html';
}

// Logout function
function logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    showAlert('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Password Strength Checker
function checkPasswordStrength(password) {
    let strength = 0;
    const feedback = [];
    
    if (password.length >= 8) strength++;
    else feedback.push('At least 8 characters');
    
    if (/[a-z]/.test(password)) strength++;
    else feedback.push('Lowercase letter');
    
    if (/[A-Z]/.test(password)) strength++;
    else feedback.push('Uppercase letter');
    
    if (/[0-9]/.test(password)) strength++;
    else feedback.push('Number');
    
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    else feedback.push('Special character');
    
    const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return {
        strength: levels[strength - 1] || 'Very Weak',
        score: strength,
        feedback: feedback
    };
}

// Email Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone Number Validation (Indian format)
function validatePhone(phone) {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone.replace(/[\s-]/g, ''));
}

// Form Validation Helper
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Remove existing error
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) existingError.remove();
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = 'var(--danger)';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
    field.style.borderColor = 'var(--danger)';
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) existingError.remove();
    field.style.borderColor = '';
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Local Storage Helper Functions
const Storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    }
};

// Date Formatting Helper
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) return 'Just now';
    
    // Less than 1 hour
    if (diff < 3600000) {
        const mins = Math.floor(diff / 60000);
        return `${mins} minute${mins > 1 ? 's' : ''} ago`;
    }
    
    // Less than 1 day
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Less than 1 week
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    
    // Format as date
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// Copy to Clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showAlert('Copied to clipboard!', 'success');
        return true;
    } catch (e) {
        console.error('Copy failed:', e);
        showAlert('Failed to copy', 'error');
        return false;
    }
}

// Confirm Dialog
function showConfirmDialog(message, onConfirm, onCancel) {
    const dialog = document.createElement('div');
    dialog.className = 'modal active';
    dialog.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <h3>Confirm Action</h3>
            <p style="margin: 1.5rem 0;">${message}</p>
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button class="btn btn-outline" id="cancelBtn">Cancel</button>
                <button class="btn btn-primary" id="confirmBtn">Confirm</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    document.getElementById('confirmBtn').onclick = () => {
        if (onConfirm) onConfirm();
        dialog.remove();
    };
    
    document.getElementById('cancelBtn').onclick = () => {
        if (onCancel) onCancel();
        dialog.remove();
    };
    
    // Close on backdrop click
    dialog.onclick = (e) => {
        if (e.target === dialog) {
            if (onCancel) onCancel();
            dialog.remove();
        }
    };
}

// Network Status Monitor
let isOnline = navigator.onLine;

window.addEventListener('online', () => {
    isOnline = true;
    showAlert('You are back online!', 'success');
});

window.addEventListener('offline', () => {
    isOnline = false;
    showAlert('You are offline. Some features may not work.', 'warning');
});

// Check API Health
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/health`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.ok;
    } catch (e) {
        console.error('API health check failed:', e);
        return false;
    }
}

// Session Timeout Handler
let sessionTimeout;
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

function resetSessionTimeout() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        showAlert('Session expired. Please login again.', 'warning');
        logout();
    }, SESSION_TIMEOUT);
}

// Track user activity
['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
    document.addEventListener(event, debounce(() => {
        if (localStorage.getItem(STORAGE_KEYS.TOKEN)) {
            resetSessionTimeout();
        }
    }, 1000));
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K: Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('memberSearch');
        if (searchInput) searchInput.focus();
    }
    
    // Escape: Close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => modal.classList.remove('active'));
    }
});

// Image Lazy Loading
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Attach form event listeners
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        console.log('Login form found, attaching event listener');
        loginForm.addEventListener('submit', handleLogin);
        
        // Add real-time email validation
        const emailField = document.getElementById('loginEmail');
        if (emailField) {
            emailField.addEventListener('blur', () => {
                if (emailField.value && !validateEmail(emailField.value)) {
                    showFieldError('loginEmail', 'Please enter a valid email');
                } else {
                    clearFieldError('loginEmail');
                }
            });
        }
    } else {
        console.warn('Login form not found');
    }
    
    if (registerForm) {
        console.log('Register form found, attaching event listener');
        registerForm.addEventListener('submit', handleRegister);
        
        // Add real-time validations
        const emailField = document.getElementById('registerEmail');
        const phoneField = document.getElementById('registerPhone');
        const passwordField = document.getElementById('registerPassword');
        const confirmPasswordField = document.getElementById('registerConfirmPassword');
        
        if (emailField) {
            emailField.addEventListener('blur', () => {
                if (emailField.value && !validateEmail(emailField.value)) {
                    showFieldError('registerEmail', 'Please enter a valid email');
                } else {
                    clearFieldError('registerEmail');
                }
            });
        }
        
        if (phoneField) {
            phoneField.addEventListener('blur', () => {
                if (phoneField.value && !validatePhone(phoneField.value)) {
                    showFieldError('registerPhone', 'Please enter a valid 10-digit phone number');
                } else {
                    clearFieldError('registerPhone');
                }
            });
        }
        
        if (passwordField) {
            passwordField.addEventListener('input', debounce(() => {
                const strength = checkPasswordStrength(passwordField.value);
                const strengthIndicator = document.getElementById('passwordStrength') || 
                    createPasswordStrengthIndicator(passwordField);
                
                updatePasswordStrength(strengthIndicator, strength);
            }, 300));
        }
        
        if (confirmPasswordField) {
            confirmPasswordField.addEventListener('blur', () => {
                if (confirmPasswordField.value && 
                    confirmPasswordField.value !== passwordField.value) {
                    showFieldError('registerConfirmPassword', 'Passwords do not match');
                } else {
                    clearFieldError('registerConfirmPassword');
                }
            });
        }
    } else {
        console.warn('Register form not found');
    }
    
    // Initialize lazy loading
    lazyLoadImages();
    
    // Start session timeout if logged in
    if (localStorage.getItem(STORAGE_KEYS.TOKEN)) {
        resetSessionTimeout();
    }
    
    // Check API health on load
    checkAPIHealth().then(isHealthy => {
        if (!isHealthy && isOnline) {
            showAlert('Unable to connect to server. Please try again later.', 'warning');
        }
    });
});

// Password Strength Indicator UI
function createPasswordStrengthIndicator(passwordField) {
    const indicator = document.createElement('div');
    indicator.id = 'passwordStrength';
    indicator.style.marginTop = '0.5rem';
    passwordField.parentElement.appendChild(indicator);
    return indicator;
}

function updatePasswordStrength(indicator, strength) {
    const colors = {
        'Very Weak': '#dc3545',
        'Weak': '#fd7e14',
        'Fair': '#ffc107',
        'Good': '#20c997',
        'Strong': '#28a745'
    };
    
    indicator.innerHTML = `
        <div style="display: flex; gap: 0.25rem; margin-bottom: 0.5rem;">
            ${[1, 2, 3, 4, 5].map(i => `
                <div style="flex: 1; height: 4px; background: ${i <= strength.score ? colors[strength.strength] : '#e0e0e0'}; border-radius: 2px;"></div>
            `).join('')}
        </div>
        <div style="font-size: 0.875rem; color: ${colors[strength.strength]};">
            ${strength.strength}${strength.feedback.length > 0 ? ': Missing ' + strength.feedback.join(', ') : ''}
        </div>
    `;
}
