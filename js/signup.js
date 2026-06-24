// ===== DOM Elements =====
const signupForm = document.getElementById('signupForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const mobileInput = document.getElementById('mobile');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirmPassword');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const mobileError = document.getElementById('mobileError');
const passwordError = document.getElementById('passwordError');
const confirmError = document.getElementById('confirmError');
const signupBtn = document.getElementById('signupSubmitBtn');
const btnText = signupBtn?.querySelector('.btn-text');
const btnLoader = signupBtn?.querySelector('.btn-loader');
const termsCheckbox = document.getElementById('termsCheckbox');
const offersCheckbox = document.getElementById('offersCheckbox');
const toast = document.getElementById('toast');

// Password strength elements
const passwordStrength = document.getElementById('passwordStrength');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-text');

// ===== Benefits Slider =====
let currentSlide = 0;
const slides = document.querySelectorAll('.benefit-slide');
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

// Auto-rotate benefits
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
                        element.textContent = target + (target === 100 ? '+' : target === 10 ? 'M+' : target === 5000 ? '+' : '');
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.floor(current) + (target === 100 ? '+' : target === 10 ? 'M+' : target === 5000 ? '+' : '');
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
function showToast(message, isError = false, isWarning = false) {
    toast.textContent = message;
    toast.className = 'toast';
    if (isError) toast.classList.add('error');
    if (isWarning) toast.classList.add('warning');
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function clearErrors() {
    nameError.textContent = '';
    emailError.textContent = '';
    mobileError.textContent = '';
    passwordError.textContent = '';
    confirmError.textContent = '';
}

function setLoading(isLoading) {
    if (isLoading) {
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        signupBtn.disabled = true;
        signupBtn.style.opacity = '0.7';
    } else {
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        signupBtn.disabled = false;
        signupBtn.style.opacity = '1';
    }
}

// ===== Password Strength Checker =====
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = '';
    
    if (password.length === 0) {
        strengthBar.style.width = '0%';
        strengthText.textContent = '';
        return;
    }
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Lowercase & Uppercase
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    
    // Numbers
    if (/[0-9]/.test(password)) strength++;
    
    // Special characters
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    // Calculate percentage
    let percentage = (strength / 5) * 100;
    
    if (strength === 0) {
        feedback = 'Very Weak';
        strengthBar.style.background = '#ef4444';
    } else if (strength <= 2) {
        feedback = 'Weak';
        strengthBar.style.background = '#f59e0b';
    } else if (strength <= 3) {
        feedback = 'Good';
        strengthBar.style.background = '#10b981';
    } else if (strength <= 4) {
        feedback = 'Strong';
        strengthBar.style.background = '#06b6d4';
    } else {
        feedback = 'Very Strong';
        strengthBar.style.background = '#10b981';
    }
    
    strengthBar.style.width = percentage + '%';
    strengthBar.style.background = `linear-gradient(90deg, #ef4444, #f59e0b, #10b981)`;
    strengthText.textContent = `Password Strength: ${feedback}`;
    strengthText.style.color = strengthBar.style.background;
}

// ===== Validation Functions =====
function validateName(name) {
    if (!name.trim()) {
        nameError.textContent = 'Full name is required';
        nameError.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            nameError.style.animation = '';
        }, 300);
        return false;
    }
    if (name.trim().length < 3) {
        nameError.textContent = 'Full name must be at least 3 characters';
        nameError.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            nameError.style.animation = '';
        }, 300);
        return false;
    }
    if (!/^[A-Za-z\s]+$/.test(name.trim())) {
        nameError.textContent = 'Full name can only contain letters and spaces';
        nameError.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            nameError.style.animation = '';
        }, 300);
        return false;
    }
    return true;
}

function validateEmail(email) {
    if (!email.trim()) {
        emailError.textContent = 'Email is required';
        emailError.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            emailError.style.animation = '';
        }, 300);
        return false;
    }
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+(com|in|org|net)$/i;
    if (!emailRegex.test(email.trim())) {
        emailError.textContent = 'Enter valid email (e.g., name@domain.com)';
        emailError.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            emailError.style.animation = '';
        }, 300);
        return false;
    }
    
    // Check if email already exists
    const users = getUsers();
    if (users.some(u => u.email === email.trim())) {
        emailError.textContent = 'Email already registered! Please login.';
        emailError.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            emailError.style.animation = '';
        }, 300);
        showToast('Email already exists! Please login instead.', true);
        return false;
    }
    return true;
}

function validateMobile(mobile) {
    if (!mobile.trim()) {
        mobileError.textContent = 'Mobile number is required';
        mobileError.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            mobileError.style.animation = '';
        }, 300);
        return false;
    }
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile.trim())) {
        mobileError.textContent = 'Enter valid 10-digit Indian mobile number (starts with 6-9)';
        mobileError.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            mobileError.style.animation = '';
        }, 300);
        return false;
    }
    
    // Check if mobile already exists
    const users = getUsers();
    if (users.some(u => u.phone === mobile.trim())) {
        mobileError.textContent = 'Mobile number already registered!';
        mobileError.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            mobileError.style.animation = '';
        }, 300);
        showToast('Mobile number already exists!', true);
        return false;
    }
    return true;
}

function validatePassword(password) {
    if (!password) {
        passwordError.textContent = 'Password is required';
        passwordError.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            passwordError.style.animation = '';
        }, 300);
        return false;
    }
    if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters';
        passwordError.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            passwordError.style.animation = '';
        }, 300);
        return false;
    }
    if (password.length > 20) {
        passwordError.textContent = 'Password must be less than 20 characters';
        return false;
    }
    return true;
}

function validateConfirm(password, confirm) {
    if (!confirm) {
        confirmError.textContent = 'Please confirm your password';
        confirmError.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            confirmError.style.animation = '';
        }, 300);
        return false;
    }
    if (password !== confirm) {
        confirmError.textContent = 'Passwords do not match';
        confirmError.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            confirmError.style.animation = '';
        }, 300);
        return false;
    }
    return true;
}

// ===== Get Users from localStorage =====
function getUsers() {
    const users = localStorage.getItem('airlineUsers');
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem('airlineUsers', JSON.stringify(users));
}

// ===== Handle Signup =====
async function handleSignup(e) {
    e.preventDefault();
    clearErrors();
    
    const fullName = fullNameInput.value;
    const email = emailInput.value;
    const mobile = mobileInput.value;
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    
    // Validate all fields
    const isNameValid = validateName(fullName);
    const isEmailValid = validateEmail(email);
    const isMobileValid = validateMobile(mobile);
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirm(password, confirm);
    
    if (!termsCheckbox.checked) {
        showToast('Please accept the Terms of Service and Privacy Policy', true);
        termsCheckbox.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            termsCheckbox.style.animation = '';
        }, 300);
        return;
    }
    
    if (isNameValid && isEmailValid && isMobileValid && isPasswordValid && isConfirmValid) {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Create new user
        const users = getUsers();
        const newUser = {
            id: Date.now(),
            fullName: fullName.trim(),
            email: email.trim(),
            phone: mobile.trim(),
            password: password,
            role: 'user',
            createdAt: new Date().toISOString(),
            offers: offersCheckbox.checked
        };
        
        users.push(newUser);
        saveUsers(users);
        
        // Show success message
        showToast('🎉 Account created successfully! Welcome to SkyWay family!');
        
        // Add success animation to button
        signupBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        // Redirect to login page after short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }
}

// ===== Toggle Password Visibility =====
function togglePassword(e) {
    const button = e.target.closest('.toggle-password');
    if (!button) return;
    
    const targetId = button.getAttribute('data-target');
    const input = document.getElementById(targetId);
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    button.querySelector('i').classList.toggle('fa-eye');
    button.querySelector('i').classList.toggle('fa-eye-slash');
    
    // Add animation
    button.style.transform = 'scale(1.1)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
}

// ===== Real-time Validation =====
function setupRealTimeValidation() {
    fullNameInput.addEventListener('blur', () => validateName(fullNameInput.value));
    emailInput.addEventListener('blur', () => validateEmail(emailInput.value));
    mobileInput.addEventListener('blur', () => validateMobile(mobileInput.value));
    passwordInput.addEventListener('input', () => {
        validatePassword(passwordInput.value);
        checkPasswordStrength(passwordInput.value);
    });
    confirmInput.addEventListener('blur', () => validateConfirm(passwordInput.value, confirmInput.value));
}

// ===== Social Signup Handlers =====
function handleSocialSignup(provider) {
    showToast(`✨ ${provider} signup coming soon! We're working on it.`, false);
    
    // Add animation to button
    const btn = document.querySelector(`.social-btn.${provider.toLowerCase()}`);
    if (btn) {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
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

// ===== Mobile Number Formatting =====
function setupMobileFormatting() {
    mobileInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) value = value.slice(0, 10);
        e.target.value = value;
    });
}

// ===== Particle Background Effect =====
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
        particle.style.animation = `floatParticle ${Math.random() * 5 + 3}s linear infinite`;
        particle.style.pointerEvents = 'none';
        leftSide.appendChild(particle);
    }
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Ctrl + S to submit
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        signupForm.dispatchEvent(new Event('submit'));
        showToast('📝 Submitting form...', false);
    }
});

// ===== Event Listeners =====
signupForm.addEventListener('submit', handleSignup);
document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', togglePassword);
});

// Social signup handlers
const googleBtn = document.getElementById('googleSignup');
const facebookBtn = document.getElementById('facebookSignup');
const appleBtn = document.getElementById('appleSignup');

if (googleBtn) googleBtn.addEventListener('click', () => handleSocialSignup('Google'));
if (facebookBtn) facebookBtn.addEventListener('click', () => handleSocialSignup('Facebook'));
if (appleBtn) appleBtn.addEventListener('click', () => handleSocialSignup('Apple'));

// Terms and Privacy links
const termsLink = document.getElementById('termsLink');
const privacyLink = document.getElementById('privacyLink');

if (termsLink) {
    termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('📜 Terms of Service will be available soon!', false);
    });
}

if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('🔒 Privacy Policy will be available soon!', false);
    });
}

// ===== Initialize =====
setupRealTimeValidation();
addInputAnimations();
setupMobileFormatting();
addParticleEffect();

// Add CSS for particles
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
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
        animation: floatParticle 5s linear infinite;
    }
`;
document.head.appendChild(style);

// Initialize password strength
strengthBar.style.position = 'relative';
strengthBar.style.height = '100%';
strengthBar.style.borderRadius = '2px';

// Check if already logged in
const loggedInUser = sessionStorage.getItem('currentUser');
if (loggedInUser) {
    showToast('You are already logged in! Redirecting...');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}