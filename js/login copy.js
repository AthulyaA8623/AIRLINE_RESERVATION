// ===== DOM Elements =====
const loginForm = document.getElementById('loginForm');
const identifierInput = document.getElementById('loginIdentifier');
const passwordInput = document.getElementById('loginPassword');
const identifierError = document.getElementById('identifierError');
const passwordError = document.getElementById('passwordError');
const loginBtn = document.getElementById('loginSubmitBtn');
const btnText = loginBtn?.querySelector('.btn-text');
const btnLoader = loginBtn?.querySelector('.btn-loader');
const togglePasswordBtn = document.getElementById('togglePassword');
const rememberMeCheckbox = document.getElementById('rememberMe');
const forgotLink = document.getElementById('forgotPassword');
const toast = document.getElementById('toast');

// ===== Testimonial Slider =====
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Auto-rotate testimonials
let slideInterval = setInterval(nextSlide, 5000);

// Dot click handlers
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        currentSlide = index;
        showSlide(currentSlide);
        slideInterval = setInterval(nextSlide, 5000);
    });
});

// ===== Statistics Counter Animation =====
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-target'));
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        element.textContent = target + (target === 100 ? '+' : target === 10 ? 'M+' : '/7');
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.floor(current) + (target === 100 ? '+' : target === 10 ? 'M+' : '/7');
                    }
                }, 30);
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(num => observer.observe(num));
}

// Trigger animations when page loads
window.addEventListener('load', () => {
    animateNumbers();
});

// ===== Helper Functions =====
function showToast(message, isError = false) {
    toast.textContent = message;
    toast.className = 'toast' + (isError ? ' error' : '');
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function clearErrors() {
    identifierError.textContent = '';
    passwordError.textContent = '';
}

function setLoading(isLoading) {
    if (isLoading) {
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        loginBtn.disabled = true;
        loginBtn.style.opacity = '0.7';
    } else {
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        loginBtn.disabled = false;
        loginBtn.style.opacity = '1';
    }
}

// ===== Get Users from localStorage =====
function getUsers() {
    const users = localStorage.getItem('airlineUsers');
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem('airlineUsers', JSON.stringify(users));
}

// ===== Initialize Demo Users =====
function initDemoUsers() {
    let users = getUsers();
    if (users.length === 0) {
        users = [
            {
                id: 1,
                fullName: "Demo User",
                email: "demo@skyway.com",
                phone: "9876543210",
                password: "demo123",
                role: "user"
            },
            {
                id: 2,
                fullName: "John Smith",
                email: "john@example.com",
                phone: "9876543211",
                password: "john123",
                role: "user"
            },
            {
                id: 3,
                fullName: "Priya Sharma",
                email: "priya@skyway.com",
                phone: "9876543212",
                password: "priya123",
                role: "user"
            }
        ];
        saveUsers(users);
    }
}

// ===== Validate Login =====
function validateLogin(identifier, password) {
    if (!identifier.trim()) {
        identifierError.textContent = 'Email or Mobile number is required';
        identifierError.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            identifierError.style.animation = '';
        }, 300);
        return false;
    }
    
    if (!password.trim()) {
        passwordError.textContent = 'Password is required';
        passwordError.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            passwordError.style.animation = '';
        }, 300);
        return false;
    }
    
    return true;
}

// ===== Handle Login =====
async function handleLogin(e) {
    e.preventDefault();
    clearErrors();
    
    const identifier = identifierInput.value.trim();
    const password = passwordInput.value;
    
    if (!validateLogin(identifier, password)) {
        return;
    }
    
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = getUsers();
    
    // Find user by email OR phone
    const user = users.find(u => u.email === identifier || u.phone === identifier);
    
    if (!user) {
        setLoading(false);
        identifierError.textContent = 'No account found with this email/phone. Please sign up.';
        identifierError.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            identifierError.style.animation = '';
        }, 300);
        showToast('Account not found! Please sign up first.', true);
        return;
    }
    
    if (user.password !== password) {
        setLoading(false);
        passwordError.textContent = 'Incorrect password. Please try again.';
        passwordError.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            passwordError.style.animation = '';
        }, 300);
        showToast('Incorrect password!', true);
        return;
    }
    
    // Login successful
    const currentUser = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
    };
    
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Save remember me option
    if (rememberMeCheckbox.checked) {
        localStorage.setItem('rememberedUser', JSON.stringify({
            identifier: identifier,
            remember: true
        }));
    } else {
        localStorage.removeItem('rememberedUser');
    }
    
    showToast(`✅ Welcome back, ${user.fullName}! Redirecting...`);
    
    // Add success animation to button
    loginBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    
    // Redirect to home page after short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// ===== Toggle Password Visibility =====
function togglePassword() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePasswordBtn.querySelector('i').classList.toggle('fa-eye');
    togglePasswordBtn.querySelector('i').classList.toggle('fa-eye-slash');
    
    // Add animation
    togglePasswordBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
        togglePasswordBtn.style.transform = 'scale(1)';
    }, 200);
}

// ===== Forgot Password Handler =====
function handleForgotPassword(e) {
    e.preventDefault();
    showToast('📧 Password reset link will be sent to your registered email!', false);
    
    // Add ripple effect
    const link = e.target;
    link.style.transform = 'scale(0.95)';
    setTimeout(() => {
        link.style.transform = 'scale(1)';
    }, 200);
}

// ===== Social Login Handlers =====
function handleSocialLogin(provider) {
    showToast(`🔐 ${provider} login coming soon! Stay tuned.`, false);
    
    // Add animation to button
    const btn = document.querySelector(`.social-btn.${provider.toLowerCase()}`);
    if (btn) {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
    }
}

// ===== Auto-fill Remembered User =====
function loadRememberedUser() {
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
        const data = JSON.parse(remembered);
        identifierInput.value = data.identifier;
        rememberMeCheckbox.checked = true;
        // Trigger label animation
        identifierInput.dispatchEvent(new Event('input'));
    }
}

// ===== Input Animation Effects =====
function addInputAnimations() {
    const inputs = document.querySelectorAll('.input-field input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.querySelector('.input-border').style.width = '100%';
        });
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.querySelector('.input-border').style.width = '0';
            }
        });
        
        // Trigger on load if has value
        if (input.value) {
            input.dispatchEvent(new Event('input'));
        }
    });
}

// ===== Floating Label Effect =====
function setupFloatingLabels() {
    const inputs = document.querySelectorAll('.input-field input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value) {
                input.classList.add('filled');
            } else {
                input.classList.remove('filled');
            }
        });
    });
}

// ===== Event Listeners =====
loginForm.addEventListener('submit', handleLogin);
if (togglePasswordBtn) togglePasswordBtn.addEventListener('click', togglePassword);
if (forgotLink) forgotLink.addEventListener('click', handleForgotPassword);

// Social login handlers
const googleBtn = document.getElementById('googleLogin');
const facebookBtn = document.getElementById('facebookLogin');
const appleBtn = document.getElementById('appleLogin');

if (googleBtn) googleBtn.addEventListener('click', () => handleSocialLogin('Google'));
if (facebookBtn) facebookBtn.addEventListener('click', () => handleSocialLogin('Facebook'));
if (appleBtn) appleBtn.addEventListener('click', () => handleSocialLogin('Apple'));

// ===== Animated Background Effect =====
function addParticleEffect() {
    const leftSide = document.querySelector('.left-side');
    if (!leftSide) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 5 + 3}s linear infinite`;
        particle.style.pointerEvents = 'none';
        leftSide.appendChild(particle);
    }
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Ctrl + L to focus on login
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        identifierInput.focus();
        showToast('🔍 Focused on email field', false);
    }
});

// ===== Initialize =====
initDemoUsers();
loadRememberedUser();
addInputAnimations();
setupFloatingLabels();
addParticleEffect();

// Check if already logged in and redirect
const loggedInUser = sessionStorage.getItem('currentUser');
if (loggedInUser) {
    showToast('You are already logged in! Redirecting...');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Add CSS for particles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        50% {
            opacity: 0.5;
        }
        100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
        }
    }
    
    .particle {
        animation: float 5s linear infinite;
    }
`;
document.head.appendChild(style);