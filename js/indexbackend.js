// ==================== BACKEND API CONFIGURATION ====================
const API_URL = 'http://localhost:5000/api';

// Store token in localStorage
let authToken = localStorage.getItem('authToken');

// ==================== SIGNUP WITH BACKEND ====================
async function signupWithBackend(fullName, email, phone, password) {
    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, phone, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            showToastMessage('Account created successfully!');
            setTimeout(() => window.location.href = 'index.html', 1500);
        } else {
            showToastMessage(data.message, true);
        }
    } catch (error) {
        showToastMessage('Server error. Please try again.', true);
    }
}

// ==================== LOGIN WITH BACKEND ====================
async function loginWithBackend(identifier, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            showToastMessage(`Welcome back, ${data.user.fullName}!`);
            setTimeout(() => window.location.href = 'index.html', 1500);
        } else {
            showToastMessage(data.message, true);
        }
    } catch (error) {
        showToastMessage('Server error. Please try again.', true);
    }
}

// ==================== CONTACT FORM WITH BACKEND ====================
async function submitContact(name, email, subject, message) {
    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToastMessage(data.message);
            return true;
        } else {
            showToastMessage(data.message, true);
            return false;
        }
    } catch (error) {
        showToastMessage('Server error. Please try again.', true);
        return false;
    }
}

// ==================== COMPLAINT FORM WITH BACKEND ====================
async function submitComplaint(name, email, mobile, pnr, issueType, message) {
    try {
        const response = await fetch(`${API_URL}/complaint`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, mobile, pnr, issueType, message })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToastMessage(data.message);
            return true;
        } else {
            showToastMessage(data.message, true);
            return false;
        }
    } catch (error) {
        showToastMessage('Server error. Please try again.', true);
        return false;
    }
}

// ==================== FLIGHT STATUS WITH BACKEND ====================
async function getFlightStatus(pnr) {
    try {
        const response = await fetch(`${API_URL}/flight-status?pnr=${pnr}`);
        const data = await response.json();
        
        if (data.success) {
            return data.booking;
        } else {
            showToastMessage(data.message, true);
            return null;
        }
    } catch (error) {
        showToastMessage('Server error. Please try again.', true);
        return null;
    }
}