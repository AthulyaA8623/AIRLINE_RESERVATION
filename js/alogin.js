// ========================================
// ADMIN LOGIN PAGE LOGIC
// BlueSky Airlines - Professional Implementation
// ========================================

// DOM Elements
const usernameInput = document.getElementById('loginUsername');
const passwordInput = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const togglePassword = document.getElementById('togglePassword');

// Admin Credentials (In production, this should be on the backend)
const ADMIN_CREDENTIALS = [
    { username: 'admin', password: 'admin123', role: 'Super Admin' },
    { username: 'airline_admin', password: 'airline@2024', role: 'Airline Admin' }
];

// Flag to track if we're checking session on page load
let isInitialCheck = true;

// ===== TOGGLE PASSWORD VISIBILITY =====
if (togglePassword) {
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });
}

// ===== SHOW TOAST NOTIFICATION =====
function showToast(message, type) {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 300);
    }, 3000);
}

// ===== VALIDATE ADMIN LOGIN =====
function validateAdminLogin(username, password) {
    return ADMIN_CREDENTIALS.find(cred => 
        cred.username === username && cred.password === password
    );
}

// ===== CHECK IF ALREADY LOGGED IN (ONLY ON REFRESH) =====
function checkExistingSession() {
    const existingSession = sessionStorage.getItem('adminSession');
    
    if (existingSession) {
        try {
            const session = JSON.parse(existingSession);
            const loginTime = new Date(session.loginTime);
            const now = new Date();
            const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
            
            // Session expires after 8 hours
            if (hoursDiff < 8) {
                // Only show message and redirect if this is an initial page load (refresh)
                if (isInitialCheck) {
                    showToast('Session active! Redirecting to dashboard...', 'success');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                }
                return true;
            } else {
                // Session expired, clear it
                sessionStorage.removeItem('adminSession');
                sessionStorage.removeItem('admin_logged_in');
                sessionStorage.removeItem('admin_username');
                if (isInitialCheck) {
                    showToast('Session expired. Please login again.', 'error');
                }
                return false;
            }
        } catch (e) {
            sessionStorage.removeItem('adminSession');
            return false;
        }
    }
    return false;
}

// ===== HANDLE LOGIN =====
function handleLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    // Validation
    if (!username || !password) {
        showToast('Please enter both username and password', 'error');
        return;
    }
    
    // Check credentials
    const admin = validateAdminLogin(username, password);
    
    if (admin) {
        // Store admin session
        const adminSession = {
            username: admin.username,
            role: admin.role,
            loginTime: new Date().toISOString(),
            isAdmin: true
        };
        sessionStorage.setItem('adminSession', JSON.stringify(adminSession));
        sessionStorage.setItem('admin_logged_in', 'true');
        sessionStorage.setItem('admin_username', admin.username);
        
        showToast(`Welcome ${admin.role}! Redirecting to dashboard...`, 'success');
        
        // Redirect to admin dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showToast('Invalid username or password! Please try again.', 'error');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// ===== CLEAR SESSION ON LOGOUT (called from logout page) =====
function clearAdminSession() {
    sessionStorage.removeItem('adminSession');
    sessionStorage.removeItem('admin_logged_in');
    sessionStorage.removeItem('admin_username');
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_session_token');
}

// ===== ENTER KEY SUPPORT =====
if (passwordInput) {
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
}

// ===== LOGIN BUTTON CLICK =====
if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
}

// ===== CHECK SESSION ON PAGE LOAD (ONLY FOR REFRESH) =====
// This will only redirect if user refreshes the page while logged in
document.addEventListener('DOMContentLoaded', function() {
    // Set isInitialCheck to true for page load
    isInitialCheck = true;
    checkExistingSession();
    // Reset flag after check
    setTimeout(() => {
        isInitialCheck = false;
    }, 100);
});

// ===== PREVENT BACK BUTTON AFTER LOGOUT =====
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Page loaded from cache (back button)
        // Only redirect if session exists AND it's not from a fresh logout
        const session = sessionStorage.getItem('adminSession');
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                const loginTime = new Date(sessionData.loginTime);
                const now = new Date();
                const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
                
                if (hoursDiff < 8) {
                    // Check if this is coming from logout by checking a flag
                    const justLoggedOut = sessionStorage.getItem('just_logged_out');
                    if (!justLoggedOut) {
                        window.location.href = 'dashboard.html';
                    } else {
                        // Clear the flag
                        sessionStorage.removeItem('just_logged_out');
                    }
                }
            } catch (e) {
                // Invalid session
                sessionStorage.removeItem('adminSession');
            }
        }
    }
});

// ===== EXPORT clearSession function for logout page =====
window.clearAdminSession = clearAdminSession;