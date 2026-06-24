// ===== DOM Elements =====
const fromCity = document.getElementById('fromCity');
const toCity = document.getElementById('toCity');
const travelDate = document.getElementById('travelDate');
const searchBtn = document.getElementById('searchFlightsBtn');
const flightResultsDiv = document.getElementById('flightResults');
const searchError = document.getElementById('searchError');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const guestBtn = document.getElementById('guestBtn');
const authButtons = document.getElementById('authButtons');
const toast = document.getElementById('successToast');
const swapIcon = document.getElementById('swapIcon');
const passengerDisplay = document.getElementById('passengerDisplay');
const passengerDropdown = document.getElementById('passengerDropdown');
const adultCountSpan = document.getElementById('adultCount');
const childCountSpan = document.getElementById('childCount');
const infantCountSpan = document.getElementById('infantCount');
const cancelPassenger = document.getElementById('cancelPassenger');
const applyPassenger = document.getElementById('applyPassenger');
const cabinClass = document.getElementById('cabinClass');
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
const preloader = document.getElementById('preloader');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelector('.nav-links');

// ===== State Variables =====
let passengerCounts = {
    adult: 1,
    child: 0,
    infant: 0
};

// ===== Set minimum date to today =====
const today = new Date().toISOString().split('T')[0];
if (travelDate) {
    travelDate.value = today;
    travelDate.min = today;
}

// ===== User Session Management =====
let currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || null;

// ===== Add Admin Icon to Navbar =====
function addAdminIcon() {
    const navContainer = document.querySelector('.nav-container');
    const authButtonsDiv = document.querySelector('.auth-buttons');
    
    if (navContainer && authButtonsDiv && !document.querySelector('.admin-icon')) {
        const adminIcon = document.createElement('div');
        adminIcon.className = 'admin-icon';
        adminIcon.innerHTML = `<a href="../html/admin/alogin.html" class="admin-link" title="Admin Login"><i class="fas fa-user-shield"></i></a>`;
        adminIcon.style.cssText = `
            display: flex;
            align-items: center;
            margin-right: 0.5rem;
        `;
        
        const adminLink = adminIcon.querySelector('.admin-link');
        if (adminLink) {
            adminLink.style.cssText = `
                color: var(--primary);
                font-size: 1.2rem;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 38px;
                height: 38px;
                border-radius: 50%;
                background: rgba(15, 76, 129, 0.1);
            `;
            adminLink.addEventListener('mouseenter', () => {
                adminLink.style.background = 'var(--primary)';
                adminLink.style.color = 'white';
                adminLink.style.transform = 'scale(1.05)';
            });
            adminLink.addEventListener('mouseleave', () => {
                adminLink.style.background = 'rgba(15, 76, 129, 0.1)';
                adminLink.style.color = 'var(--primary)';
                adminLink.style.transform = 'scale(1)';
            });
        }
        
        // Insert admin icon before auth buttons
        authButtonsDiv.parentNode.insertBefore(adminIcon, authButtonsDiv);
    }
}

// ===== Flight Database =====
const allFlights = [
    { 
        flightNo: "AI-202", 
        airline: "Air India", 
        from: "Chennai (MAA)", 
        to: "Delhi (DEL)", 
        depart: "08:30", 
        departAmPm: "AM",
        arrival: "11:45", 
        arrivalAmPm: "AM",
        price: 4500, 
        duration: "3h 15m"
    },
    { 
        flightNo: "6E-345", 
        airline: "IndiGo", 
        from: "Chennai (MAA)", 
        to: "Bengaluru (BLR)", 
        depart: "10:00", 
        departAmPm: "AM",
        arrival: "11:15", 
        arrivalAmPm: "AM",
        price: 2800, 
        duration: "1h 15m"
    },
    { 
        flightNo: "SG-101", 
        airline: "SpiceJet", 
        from: "Mumbai (BOM)", 
        to: "Delhi (DEL)", 
        depart: "02:00", 
        departAmPm: "PM",
        arrival: "04:30", 
        arrivalAmPm: "PM",
        price: 3999, 
        duration: "2h 30m"
    },
    { 
        flightNo: "AI-888", 
        airline: "Air India", 
        from: "Delhi (DEL)", 
        to: "Mumbai (BOM)", 
        depart: "07:00", 
        departAmPm: "AM",
        arrival: "09:15", 
        arrivalAmPm: "AM",
        price: 5200, 
        duration: "2h 15m"
    },
    { 
        flightNo: "6E-777", 
        airline: "IndiGo", 
        from: "Bengaluru (BLR)", 
        to: "Chennai (MAA)", 
        depart: "06:45", 
        departAmPm: "PM",
        arrival: "07:55", 
        arrivalAmPm: "PM",
        price: 2100, 
        duration: "1h 10m"
    },
    { 
        flightNo: "SG-202", 
        airline: "SpiceJet", 
        from: "Chennai (MAA)", 
        to: "Delhi (DEL)", 
        depart: "09:15", 
        departAmPm: "PM",
        arrival: "12:30", 
        arrivalAmPm: "AM",
        price: 4899, 
        duration: "3h 15m"
    },
    { 
        flightNo: "6E-999", 
        airline: "IndiGo", 
        from: "Chennai (MAA)", 
        to: "Mumbai (BOM)", 
        depart: "06:00", 
        departAmPm: "AM",
        arrival: "08:15", 
        arrivalAmPm: "AM",
        price: 3500, 
        duration: "2h 15m"
    },
    { 
        flightNo: "AI-456", 
        airline: "Air India", 
        from: "Chennai (MAA)", 
        to: "Kolkata (CCU)", 
        depart: "05:30", 
        departAmPm: "PM",
        arrival: "08:00", 
        arrivalAmPm: "PM",
        price: 4200, 
        duration: "2h 30m"
    }
];

// ===== Preloader =====
if (preloader) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
        backToTop.classList.add('show');
    } else {
        navbar.classList.remove('scrolled');
        backToTop.classList.remove('show');
    }
});

// ===== Mobile Menu Toggle =====
if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenu.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// ===== Back to Top =====
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== AOS Initialization =====
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
}

// ===== Helper Functions =====
function showToastMessage(message, isError = false) {
    toast.textContent = message;
    toast.style.backgroundColor = isError ? '#dc2626' : '#10b981';
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2500);
}

function updateAuthUI() {
    if (currentUser) {
        if (currentUser.isGuest) {
            authButtons.innerHTML = `
                <span class="guest-badge" style="background: rgba(15,76,129,0.1); padding: 0.5rem 1rem; border-radius: 8px; color: var(--primary); font-weight: 500; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-user-friends"></i>
                    <span>Guest Mode</span>
                </span>
                <button class="btn-outline" id="logoutBtn">
                    <i class="fas fa-sign-in-alt"></i>
                    <span>Sign In</span>
                </button>
            `;
        } else {
            authButtons.innerHTML = `
                <span class="user-badge" style="background: rgba(15,76,129,0.1); padding: 0.5rem 1rem; border-radius: 8px; color: var(--primary); font-weight: 500; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-user-circle"></i>
                    <span>${currentUser.fullName?.split(' ')[0] || 'User'}</span>
                </span>
                <button class="btn-outline" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </button>
            `;
        }
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.onclick = () => {
                sessionStorage.removeItem('currentUser');
                currentUser = null;
                showToastMessage('Logged out successfully!');
                setTimeout(() => location.reload(), 1000);
            };
        }
    } else {
        authButtons.innerHTML = `
            <button class="btn-outline" id="loginBtn">
                <i class="fas fa-user"></i>
                <span>Login</span>
            </button>
            <button class="btn-primary" id="signupBtn">
                <i class="fas fa-user-plus"></i>
                <span>Sign Up</span>
            </button>
            <button class="btn-guest" id="guestBtn">
                <i class="fas fa-user-friends"></i>
                <span>Guest</span>
            </button>
        `;
        
        const newLoginBtn = document.getElementById('loginBtn');
        const newSignupBtn = document.getElementById('signupBtn');
        const newGuestBtn = document.getElementById('guestBtn');
        
        if (newLoginBtn) newLoginBtn.addEventListener('click', () => window.location.href = 'login.html');
        if (newSignupBtn) newSignupBtn.addEventListener('click', () => window.location.href = 'signup.html');
        if (newGuestBtn) newGuestBtn.addEventListener('click', setGuestMode);
    }
}

function updatePassengerDisplay() {
    const parts = [];
    if (passengerCounts.adult > 0) parts.push(`${passengerCounts.adult} Adult${passengerCounts.adult > 1 ? 's' : ''}`);
    if (passengerCounts.child > 0) parts.push(`${passengerCounts.child} Child${passengerCounts.child > 1 ? 'ren' : ''}`);
    if (passengerCounts.infant > 0) parts.push(`${passengerCounts.infant} Infant${passengerCounts.infant > 1 ? 's' : ''}`);
    passengerDisplay.value = parts.join(', ') || '0 Adult';
}

// ===== Guest Mode Function =====
function setGuestMode() {
    currentUser = { 
        fullName: "Guest User", 
        isGuest: true,
        id: 'guest_' + Date.now()
    };
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    showToastMessage('🎉 You are now in Guest mode! You can search and book flights.', false);
    
    setTimeout(() => {
        showToastMessage('✈️ Guest users can book flights with limited features. Sign up for full benefits!', false);
    }, 2000);
}

// ===== Flight Search Validation =====
function validateSearch() {
    const from = fromCity.value;
    const to = toCity.value;
    const date = travelDate.value;
    const totalPassengers = passengerCounts.adult + passengerCounts.child + passengerCounts.infant;
    
    searchError.textContent = '';
    
    if (from === to) {
        searchError.textContent = '❌ Source and destination cannot be the same!';
        return false;
    }
    
    const selectedDate = new Date(date);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    if (selectedDate < todayDate) {
        searchError.textContent = '❌ Travel date cannot be in the past!';
        return false;
    }
    
    if (totalPassengers <= 0) {
        searchError.textContent = '❌ At least one passenger is required!';
        return false;
    }
    
    return true;
}

// ===== Search Flights - REDIRECT TO FLIGHTS PAGE =====
function searchFlights() {
    if (!validateSearch()) return;
    
    const from = fromCity.value;
    const to = toCity.value;
    const date = travelDate.value;
    const passengers = {
        adult: passengerCounts.adult,
        child: passengerCounts.child,
        infant: passengerCounts.infant,
        total: passengerCounts.adult + passengerCounts.child + passengerCounts.infant
    };
    
    // Store search parameters in localStorage to use on flights page
    const searchParams = {
        from: from,
        to: to,
        date: date,
        passengers: passengers,
        cabinClass: cabinClass.value
    };
    
    localStorage.setItem('flightSearchParams', JSON.stringify(searchParams));
    
    // Show loading message
    showToastMessage('✈️ Searching for flights... Redirecting to flights page', false);
    
    // Redirect to flights.html after short delay
    setTimeout(() => {
        window.location.href = 'flights.html';
    }, 800);
}

// ===== Swap Cities =====
function swapCities() {
    const from = fromCity.value;
    const to = toCity.value;
    fromCity.value = to;
    toCity.value = from;
    showToastMessage('Cities swapped!', false);
}

// ===== Passenger Dropdown =====
if (passengerDisplay) {
    passengerDisplay.addEventListener('click', () => {
        passengerDropdown.classList.toggle('active');
    });
}

document.querySelectorAll('.counter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = btn.getAttribute('data-type');
        const op = btn.getAttribute('data-op');
        
        if (op === 'plus') {
            if (type === 'adult') passengerCounts.adult++;
            if (type === 'child') passengerCounts.child++;
            if (type === 'infant') {
                if (passengerCounts.infant < passengerCounts.adult) {
                    passengerCounts.infant++;
                } else {
                    showToastMessage('Infants cannot exceed number of adults', true);
                    return;
                }
            }
        } else if (op === 'minus') {
            if (type === 'adult' && passengerCounts.adult > 1) passengerCounts.adult--;
            if (type === 'child' && passengerCounts.child > 0) passengerCounts.child--;
            if (type === 'infant' && passengerCounts.infant > 0) passengerCounts.infant--;
        }
        
        adultCountSpan.textContent = passengerCounts.adult;
        childCountSpan.textContent = passengerCounts.child;
        infantCountSpan.textContent = passengerCounts.infant;
    });
});

function applyPassengerSelection() {
    updatePassengerDisplay();
    passengerDropdown.classList.remove('active');
    showToastMessage('Passengers updated!', false);
}

if (cancelPassenger) {
    cancelPassenger.addEventListener('click', () => {
        passengerDropdown.classList.remove('active');
    });
}

if (applyPassenger) {
    applyPassenger.addEventListener('click', applyPassengerSelection);
}

// ===== Tab Switching =====
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.getAttribute('data-tab');
        if (tab === 'roundtrip') {
            showToastMessage('Round trip feature coming soon! Stay tuned for exciting offers.', false);
        } else if (tab === 'multicity') {
            showToastMessage('Multi city feature coming soon! Book multiple destinations with ease.', false);
        }
    });
});

// ===== Newsletter Subscription =====
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    const subscribeBtn = newsletterForm.querySelector('button');
    const emailInput = newsletterForm.querySelector('input');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', () => {
            if (emailInput && emailInput.value) {
                showToastMessage('🎉 Subscribed successfully! Check your email for updates.', false);
                emailInput.value = '';
            } else {
                showToastMessage('Please enter a valid email address', true);
            }
        });
    }
}

// ===== Quick Book =====
const quickBookBtn = document.querySelector('.quick-book-btn');
if (quickBookBtn) {
    quickBookBtn.addEventListener('click', () => {
        const pnrInput = document.querySelector('.quick-book-input input');
        if (pnrInput && pnrInput.value) {
            if (currentUser) {
                showToastMessage('🔍 Retrieving booking... This feature will be available soon!', false);
            } else {
                showToastMessage('Please login to view your bookings', true);
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }
        } else {
            showToastMessage('Please enter a valid PNR number', true);
        }
    });
}

// ===== Offer Button =====
const offerBtn = document.querySelector('.offer-btn');
if (offerBtn) {
    offerBtn.addEventListener('click', () => {
        if (currentUser) {
            showToastMessage('🎉 Promo code SKYWAY30 applied! Book now to save 30%', false);
        } else {
            showToastMessage('Please login or signup to apply this offer!', true);
        }
    });
}

// ===== Route Cards Click =====
document.querySelectorAll('.route-card').forEach(card => {
    card.addEventListener('click', () => {
        const cities = card.querySelector('.route-cities');
        if (cities) {
            const spans = cities.querySelectorAll('span');
            if (spans.length >= 2) {
                fromCity.value = spans[0].textContent;
                toCity.value = spans[2].textContent;
                searchFlights();
            }
        }
    });
});

// ===== Animated Counters for Stats =====
function animateStats() {
    const stats = document.querySelectorAll('.stat span:first-child');
    stats.forEach(stat => {
        const targetText = stat.textContent;
        const target = parseInt(targetText);
        if (target && !isNaN(target)) {
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current).toLocaleString();
                }
            }, 20);
        }
    });
}

// Trigger stats animation when visible
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.hero-stats');
if (statsSection) observer.observe(statsSection);

// ===== Event Listeners =====
if (searchBtn) searchBtn.addEventListener('click', searchFlights);
if (swapIcon) swapIcon.addEventListener('click', swapCities);

// Allow Enter key on search
if (fromCity) fromCity.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchFlights(); });
if (toCity) toCity.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchFlights(); });
if (travelDate) travelDate.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchFlights(); });

// ===== Initialize =====
updateAuthUI();
addAdminIcon();  // Add admin icon to navbar
updatePassengerDisplay();

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (passengerDisplay && passengerDropdown && 
        !passengerDisplay.contains(e.target) && 
        !passengerDropdown.contains(e.target)) {
        passengerDropdown.classList.remove('active');
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileMenu && navLinks && navLinks.classList.contains('active')) {
        if (!mobileMenu.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            const icon = mobileMenu.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
});

// Check if user is guest and show welcome message
if (currentUser && currentUser.isGuest) {
    setTimeout(() => {
        showToastMessage('👋 Welcome Guest! You can search and book flights. Sign up for exclusive benefits!', false);
    }, 1000);
}