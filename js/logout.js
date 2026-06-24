// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const redirectBtn = document.getElementById('redirectBtn');
    const countdownSpan = document.getElementById('countdown');
    const logoutCard = document.querySelector('.logout-card');
    
    let countdown = 3;
    let countdownInterval = null;
    
    // Clear all user data from localStorage and sessionStorage
    function clearUserSession() {
        // Clear admin session from sessionStorage
        sessionStorage.removeItem('adminSession');
        sessionStorage.removeItem('admin_logged_in');
        sessionStorage.removeItem('admin_username');
        sessionStorage.removeItem('admin_session_token');
        sessionStorage.removeItem('admin_email');
        
        // Set flag to prevent auto-login on back button
        sessionStorage.setItem('just_logged_out', 'true');
        
        // Clear localStorage admin flags
        localStorage.removeItem('admin_logged_in');
        localStorage.removeItem('admin_username');
        localStorage.removeItem('admin_session_token');
        localStorage.removeItem('admin_email');
        
        // Clear any other session data
        sessionStorage.removeItem('login_time');
        sessionStorage.removeItem('admin_token');
        
        // Clear any other admin-related data
        localStorage.removeItem('admin_session');
        
        // Add success animation to card
        if (logoutCard) {
            logoutCard.classList.add('success');
        }
    }
    
    // Update countdown display
    function updateCountdown() {
        if (countdownSpan) {
            countdownSpan.textContent = countdown;
        }
        
        if (countdown <= 0) {
            // Stop countdown
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            // Redirect to index.html inside html folder
            redirectToLogin();
        }
    }
    
    // Redirect to index.html (inside html folder)
    function redirectToLogin() {
        // Add fade out animation before redirect
        const container = document.querySelector('.logout-container');
        if (container) {
            container.style.animation = 'fadeOutDown 0.3s ease forwards';
        }
        
        setTimeout(() => {
            // Go up one level from admin folder to html folder, then to index.html
            window.location.href = '../index.html';
        }, 300);
    }
    
    // Start countdown timer
    function startCountdown() {
        updateCountdown();
        
        countdownInterval = setInterval(() => {
            countdown--;
            updateCountdown();
        }, 1000);
    }
    
    // Handle manual redirect button click
    function handleManualRedirect() {
        // Stop auto countdown
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        
        // Add click animation
        if (redirectBtn) {
            redirectBtn.style.transform = 'scale(0.98)';
            setTimeout(() => {
                redirectBtn.style.transform = '';
            }, 150);
        }
        
        // Redirect immediately
        redirectToLogin();
    }
    
    // Add CSS animation for fadeOutDown
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOutDown {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(30px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Perform logout
    async function performLogout() {
        // Clear session data
        clearUserSession();
        
        // Log logout event to console
        console.log('Admin logged out at:', new Date().toLocaleString());
        console.log('Redirecting to ../index.html (home page)...');
        
        // Start countdown
        startCountdown();
    }
    
    // Add keyboard support
    function addKeyboardSupport() {
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && redirectBtn && redirectBtn === document.activeElement) {
                handleManualRedirect();
            }
        });
        
        // Auto-focus the button
        if (redirectBtn) {
            setTimeout(() => {
                redirectBtn.focus();
            }, 100);
        }
    }
    
    // Add particle effect
    function addParticleEffect() {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.backgroundColor = '#1f6e8c';
            particle.style.borderRadius = '50%';
            particle.style.opacity = '0';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '999';
            document.body.appendChild(particle);
            
            const startX = Math.random() * window.innerWidth;
            const startY = window.innerHeight;
            
            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            particle.style.animation = `particleFloat 1s ease-out forwards`;
            
            if (!document.querySelector('#particleStyles')) {
                const style = document.createElement('style');
                style.id = 'particleStyles';
                style.textContent = `
                    @keyframes particleFloat {
                        0% {
                            opacity: 0;
                            transform: translate(0, 0);
                        }
                        20% {
                            opacity: 0.6;
                        }
                        100% {
                            opacity: 0;
                            transform: translate(${(Math.random() - 0.5) * 200}px, -100px);
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }
    
    // Initialize
    function init() {
        addAnimationStyles();
        performLogout();
        addKeyboardSupport();
        
        if (redirectBtn) {
            redirectBtn.addEventListener('click', handleManualRedirect);
        }
        
        setTimeout(() => {
            addParticleEffect();
        }, 500);
        
        console.log('%c🔐 You have been logged out. Redirecting to index.html...', 
                    'color: #1f6e8c; font-size: 12px;');
    }
    
    init();
});