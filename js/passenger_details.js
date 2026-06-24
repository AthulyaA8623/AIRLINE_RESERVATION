// ========================================
// PASSENGER DETAILS - COMPLETE WORKING VERSION
// ========================================

let flightData = null;
let selectedClass = 'economy';
let baseFare = 0;
let businessMultiplier = 1.8;
let passengers = [];
let passengerIdCounter = 1;

const ageMultiplier = {
    infant: 0.1,
    child: 0.75,
    adult: 1.0
};

// DOM Elements
const flightContainer = document.getElementById('flightInfoContainer');
const fareOptions = document.querySelectorAll('.fare-option');
const totalSpan = document.getElementById('totalAmountDisplay');
const baseFareAmountSpan = document.getElementById('baseFareAmount');
const passengerFareBreakdown = document.getElementById('passengerFareBreakdown');
const proceedBtn = document.getElementById('proceedBtn');
const passengersContainer = document.getElementById('passengersContainer');
const addPassengerBtn = document.getElementById('addPassengerBtn');

// Load flight data
function loadFlightData() {
    const stored = localStorage.getItem('selectedFlight');
    if (!stored) {
        flightData = {
            flight: {
                airline: "Air India",
                flightNo: "AI202",
                origin: "Chennai (MAA)",
                dest: "Delhi (DEL)",
                dept: "08:30",
                arr: "11:45",
                duration: "3h 15m"
            },
            selectedClass: "economy",
            totalPrice: 4500,
            passengers: 1,
            travelDate: "2026-04-20",
            from: "Chennai (MAA)",
            to: "Delhi (DEL)"
        };
    } else {
        flightData = JSON.parse(stored);
    }
    
    baseFare = flightData.totalPrice || 4500;
    if (flightData.selectedClass) selectedClass = flightData.selectedClass;
    
    // Initialize passengers
    const initialCount = flightData.passengers || 1;
    for (let i = 0; i < initialCount; i++) {
        passengers.push({
            id: passengerIdCounter++,
            name: '',
            age: '',
            gender: '',
            dob: '',
            nationality: 'Indian',
            passportNumber: '',
            frequentFlyer: '',
            fare: 0,
            category: 'adult'
        });
    }
    
    renderFlightInfo();
    updateFarePrices();
    highlightFareOption();
    renderAllPassengers();
    recalcTotal();
}

function renderFlightInfo() {
    const f = flightData.flight;
    const date = flightData.travelDate || "20 April 2026";
    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
    
    flightContainer.innerHTML = `
        <div class="flight-title">
            <i class="fas fa-plane"></i>
            <span>Your Flight</span>
        </div>
        <div class="flight-details">
            <div class="detail-item">
                <div class="detail-label">Flight</div>
                <div class="detail-value">${f.airline} (${f.flightNo})</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Route</div>
                <div class="detail-value">${flightData.from || f.origin} → ${flightData.to || f.dest}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Date</div>
                <div class="detail-value">${formattedDate}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Departure</div>
                <div class="detail-value">${f.dept}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Arrival</div>
                <div class="detail-value">${f.arr}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Duration</div>
                <div class="detail-value">${f.duration}</div>
            </div>
        </div>
    `;
}

function updateFarePrices() {
    const economyPriceSpan = document.getElementById('economyPrice');
    const businessPriceSpan = document.getElementById('businessPrice');
    if (economyPriceSpan) economyPriceSpan.innerText = `₹${baseFare.toLocaleString()}`;
    if (businessPriceSpan) businessPriceSpan.innerText = `₹${Math.round(baseFare * businessMultiplier).toLocaleString()}`;
}

function highlightFareOption() {
    fareOptions.forEach(opt => {
        opt.classList.remove('selected');
        if (opt.dataset.class === selectedClass) opt.classList.add('selected');
    });
}

fareOptions.forEach(opt => {
    opt.addEventListener('click', () => {
        selectedClass = opt.dataset.class;
        highlightFareOption();
        recalcTotal();
    });
});

// Calculate fare for a passenger
function calculatePassengerFare(age) {
    let adultFare = baseFare;
    if (selectedClass === 'business') adultFare = Math.round(baseFare * businessMultiplier);
    
    if (!age || age === '') return 0;
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) return 0;
    
    let multiplier = ageNum < 2 ? ageMultiplier.infant : (ageNum < 12 ? ageMultiplier.child : ageMultiplier.adult);
    return Math.round(adultFare * multiplier);
}

function getCategoryFromAge(age) {
    if (!age || age === '') return 'adult';
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) return 'adult';
    if (ageNum < 2) return 'infant';
    if (ageNum < 12) return 'child';
    return 'adult';
}

function updatePassengerFare(index) {
    const passenger = passengers[index];
    const age = passenger.age;
    passenger.fare = calculatePassengerFare(age);
    passenger.category = getCategoryFromAge(age);
}

function recalcTotal() {
    let total = 0;
    for (let i = 0; i < passengers.length; i++) {
        updatePassengerFare(i);
        total += passengers[i].fare;
    }
    
    if (totalSpan) totalSpan.innerText = `₹${total.toLocaleString()}`;
    if (baseFareAmountSpan) {
        let adultFare = baseFare;
        if (selectedClass === 'business') adultFare = Math.round(baseFare * businessMultiplier);
        baseFareAmountSpan.innerText = `₹${adultFare.toLocaleString()}`;
    }
    
    // Update fare breakdown
    updateFareBreakdown();
    
    // Update each passenger's fare display in their card
    updateAllPassengerFareDisplays();
    
    return total;
}

function updateFareBreakdown() {
    if (!passengerFareBreakdown) return;
    
    let html = '';
    for (let i = 0; i < passengers.length; i++) {
        const p = passengers[i];
        const categoryName = p.category === 'infant' ? 'Infant' : (p.category === 'child' ? 'Child' : 'Adult');
        const categoryIcon = p.category === 'infant' ? '👶' : (p.category === 'child' ? '🧒' : '👤');
        
        if (p.fare > 0) {
            html += `
                <div class="passenger-fare-row">
                    <span>${categoryIcon} Passenger ${i + 1} (${categoryName})</span>
                    <span>₹${p.fare.toLocaleString()}</span>
                </div>
            `;
        }
    }
    passengerFareBreakdown.innerHTML = html;
}

function updateAllPassengerFareDisplays() {
    for (let i = 0; i < passengers.length; i++) {
        updateSinglePassengerFareDisplay(i);
    }
}

function updateSinglePassengerFareDisplay(index) {
    const fareSpan = document.getElementById(`passenger-fare-${index}`);
    if (fareSpan) {
        const p = passengers[index];
        const categoryName = p.category === 'infant' ? 'Infant' : (p.category === 'child' ? 'Child' : 'Adult');
        if (p.fare > 0) {
            fareSpan.innerHTML = `₹${p.fare.toLocaleString()} <span style="font-size:0.6rem;">(${categoryName})</span>`;
        } else {
            fareSpan.innerHTML = `-- <span style="font-size:0.6rem;">(${categoryName})</span>`;
        }
    }
}

// Render all passenger forms
function renderAllPassengers() {
    if (!passengersContainer) return;
    
    passengersContainer.innerHTML = '';
    
    for (let i = 0; i < passengers.length; i++) {
        const p = passengers[i];
        const passengerCard = document.createElement('div');
        passengerCard.className = 'passenger-card';
        passengerCard.setAttribute('data-index', i);
        
        const currentFare = p.fare || calculatePassengerFare(p.age);
        const category = p.category || getCategoryFromAge(p.age);
        const categoryName = category === 'infant' ? 'Infant' : (category === 'child' ? 'Child' : 'Adult');
        const fareDisplay = currentFare > 0 ? `₹${currentFare.toLocaleString()}` : '--';
        
        passengerCard.innerHTML = `
            <div class="passenger-header">
                <div class="passenger-title">
                    <i class="fas fa-user-circle"></i>
                    <span>Passenger ${i + 1}</span>
                </div>
                <div class="passenger-fare" id="passenger-fare-${i}">
                    ${fareDisplay} <span style="font-size:0.6rem;">(${categoryName})</span>
                </div>
                ${passengers.length > 1 ? `<button class="remove-passenger" data-index="${i}"><i class="fas fa-trash-alt"></i></button>` : ''}
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Full Name <span class="required">*</span></label>
                    <input type="text" class="p-name" data-index="${i}" value="${escapeHtml(p.name)}" placeholder="As per ID proof">
                    <div class="error-msg name-error" data-index="${i}"></div>
                </div>
                <div class="form-group">
                    <label>Age <span class="required">*</span></label>
                    <input type="number" class="p-age" data-index="${i}" value="${p.age}" min="0" max="120" placeholder="Years">
                    <div class="error-msg age-error" data-index="${i}"></div>
                </div>
                <div class="form-group">
                    <label>Gender <span class="required">*</span></label>
                    <select class="p-gender" data-index="${i}">
                        <option value="">Select</option>
                        <option value="Male" ${p.gender === 'Male' ? 'selected' : ''}>Male</option>
                        <option value="Female" ${p.gender === 'Female' ? 'selected' : ''}>Female</option>
                        <option value="Other" ${p.gender === 'Other' ? 'selected' : ''}>Other</option>
                    </select>
                    <div class="error-msg gender-error" data-index="${i}"></div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Date of Birth <span class="optional">(Optional)</span></label>
                    <input type="date" class="p-dob" data-index="${i}" value="${p.dob || ''}">
                </div>
                <div class="form-group">
                    <label>Nationality</label>
                    <select class="p-nationality" data-index="${i}">
                        <option value="Indian" ${p.nationality === 'Indian' ? 'selected' : ''}>Indian</option>
                        <option value="American" ${p.nationality === 'American' ? 'selected' : ''}>American</option>
                        <option value="British" ${p.nationality === 'British' ? 'selected' : ''}>British</option>
                        <option value="Canadian" ${p.nationality === 'Canadian' ? 'selected' : ''}>Canadian</option>
                        <option value="Australian" ${p.nationality === 'Australian' ? 'selected' : ''}>Australian</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Passport Number <span class="optional">(Optional)</span></label>
                    <input type="text" class="p-passport" data-index="${i}" value="${escapeHtml(p.passportNumber)}" placeholder="For international travel">
                </div>
                <div class="form-group">
                    <label>Frequent Flyer Number <span class="optional">(Optional)</span></label>
                    <input type="text" class="p-frequent" data-index="${i}" value="${escapeHtml(p.frequentFlyer)}" placeholder="FFN number">
                </div>
            </div>
        `;
        
        passengersContainer.appendChild(passengerCard);
    }
    
    attachAllEventListeners();
}

function attachAllEventListeners() {
    // Name inputs
    document.querySelectorAll('.p-name').forEach(input => {
        input.removeEventListener('input', handleNameInput);
        input.addEventListener('input', handleNameInput);
    });
    
    // Age inputs
    document.querySelectorAll('.p-age').forEach(input => {
        input.removeEventListener('input', handleAgeInput);
        input.addEventListener('input', handleAgeInput);
    });
    
    // Gender selects
    document.querySelectorAll('.p-gender').forEach(select => {
        select.removeEventListener('change', handleGenderChange);
        select.addEventListener('change', handleGenderChange);
    });
    
    // DOB inputs
    document.querySelectorAll('.p-dob').forEach(input => {
        input.removeEventListener('change', handleDobChange);
        input.addEventListener('change', handleDobChange);
    });
    
    // Nationality selects
    document.querySelectorAll('.p-nationality').forEach(select => {
        select.removeEventListener('change', handleNationalityChange);
        select.addEventListener('change', handleNationalityChange);
    });
    
    // Passport inputs
    document.querySelectorAll('.p-passport').forEach(input => {
        input.removeEventListener('input', handlePassportInput);
        input.addEventListener('input', handlePassportInput);
    });
    
    // Frequent flyer inputs
    document.querySelectorAll('.p-frequent').forEach(input => {
        input.removeEventListener('input', handleFrequentInput);
        input.addEventListener('input', handleFrequentInput);
    });
    
    // Remove buttons
    document.querySelectorAll('.remove-passenger').forEach(btn => {
        btn.removeEventListener('click', handleRemovePassenger);
        btn.addEventListener('click', handleRemovePassenger);
    });
}

function handleNameInput(e) {
    const index = parseInt(e.target.dataset.index);
    passengers[index].name = e.target.value;
    validatePassengerName(index);
}

function handleAgeInput(e) {
    const index = parseInt(e.target.dataset.index);
    passengers[index].age = e.target.value;
    validatePassengerAge(index);
    recalcTotal();
    updateSinglePassengerFareDisplay(index);
}

function handleGenderChange(e) {
    const index = parseInt(e.target.dataset.index);
    passengers[index].gender = e.target.value;
    validatePassengerGender(index);
}

function handleDobChange(e) {
    const index = parseInt(e.target.dataset.index);
    passengers[index].dob = e.target.value;
}

function handleNationalityChange(e) {
    const index = parseInt(e.target.dataset.index);
    passengers[index].nationality = e.target.value;
}

function handlePassportInput(e) {
    const index = parseInt(e.target.dataset.index);
    passengers[index].passportNumber = e.target.value;
}

function handleFrequentInput(e) {
    const index = parseInt(e.target.dataset.index);
    passengers[index].frequentFlyer = e.target.value;
}

function handleRemovePassenger(e) {
    const index = parseInt(e.target.dataset.index);
    removePassenger(index);
}

function validatePassengerName(index) {
    const name = passengers[index].name;
    const nameError = document.querySelector(`.name-error[data-index="${index}"]`);
    const nameInput = document.querySelector(`.p-name[data-index="${index}"]`);
    
    if (!name || name.length < 3 || !/^[a-zA-Z\s]+$/.test(name)) {
        if (nameError) nameError.innerText = "Name must contain only letters and at least 3 characters";
        if (nameInput) nameInput.style.borderColor = "#e11d48";
        return false;
    } else {
        if (nameError) nameError.innerText = "";
        if (nameInput) nameInput.style.borderColor = "#e2e8f0";
        return true;
    }
}

function validatePassengerAge(index) {
    const age = parseInt(passengers[index].age);
    const ageError = document.querySelector(`.age-error[data-index="${index}"]`);
    const ageInput = document.querySelector(`.p-age[data-index="${index}"]`);
    
    if (isNaN(age) || age < 0 || age > 120) {
        if (ageError) ageError.innerText = "Enter a valid age (0-120)";
        if (ageInput) ageInput.style.borderColor = "#e11d48";
        return false;
    } else {
        if (ageError) ageError.innerText = "";
        if (ageInput) ageInput.style.borderColor = "#e2e8f0";
        return true;
    }
}

function validatePassengerGender(index) {
    const gender = passengers[index].gender;
    const genderError = document.querySelector(`.gender-error[data-index="${index}"]`);
    const genderSelect = document.querySelector(`.p-gender[data-index="${index}"]`);
    
    if (!gender) {
        if (genderError) genderError.innerText = "Please select gender";
        if (genderSelect) genderSelect.style.borderColor = "#e11d48";
        return false;
    } else {
        if (genderError) genderError.innerText = "";
        if (genderSelect) genderSelect.style.borderColor = "#e2e8f0";
        return true;
    }
}

function validateAllPassengers() {
    let allValid = true;
    for (let i = 0; i < passengers.length; i++) {
        const nameValid = validatePassengerName(i);
        const ageValid = validatePassengerAge(i);
        const genderValid = validatePassengerGender(i);
        if (!nameValid || !ageValid || !genderValid) allValid = false;
    }
    return allValid;
}

function validateContact() {
    let valid = true;
    const phone = document.getElementById('phone')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const phoneError = document.getElementById('phoneError');
    const emailError = document.getElementById('emailError');
    
    if (!phone || !/^\d{10}$/.test(phone)) {
        if (phoneError) phoneError.innerText = "Enter a valid 10-digit mobile number";
        valid = false;
    } else {
        if (phoneError) phoneError.innerText = "";
    }
    
    if (!email || !/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email)) {
        if (emailError) emailError.innerText = "Enter a valid email address";
        valid = false;
    } else {
        if (emailError) emailError.innerText = "";
    }
    return valid;
}

function addPassenger() {
    const newPassenger = {
        id: passengerIdCounter++,
        name: '',
        age: '',
        gender: '',
        dob: '',
        nationality: 'Indian',
        passportNumber: '',
        frequentFlyer: '',
        fare: 0,
        category: 'adult'
    };
    passengers.push(newPassenger);
    renderAllPassengers();
    recalcTotal();
    showToast("New passenger added", "success");
}

function removePassenger(index) {
    if (passengers.length <= 1) {
        showToast("At least one passenger is required", "error");
        return;
    }
    passengers.splice(index, 1);
    renderAllPassengers();
    recalcTotal();
    showToast("Passenger removed", "success");
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function proceedToAddons() {
    if (!selectedClass) {
        document.getElementById('fareError').innerText = "Please select a fare class";
        return;
    }
    
    if (!validateAllPassengers()) {
        showToast("Please complete all passenger details correctly", 'error');
        return;
    }
    
    if (!validateContact()) return;
    
    // Prepare passenger details for storage
    const passengerDetails = [];
    for (let i = 0; i < passengers.length; i++) {
        const p = passengers[i];
        const age = parseInt(p.age);
        const category = age < 2 ? "infant" : (age < 12 ? "child" : "adult");
        
        passengerDetails.push({
            name: p.name,
            age: age,
            gender: p.gender,
            dob: p.dob,
            nationality: p.nationality,
            passportNumber: p.passportNumber,
            frequentFlyer: p.frequentFlyer,
            fare: p.fare,
            category: category
        });
    }
    
    const contact = {
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim()
    };
    
    let adultFare = baseFare;
    if (selectedClass === 'business') adultFare = Math.round(baseFare * businessMultiplier);
    
    const fareSelection = {
        class: selectedClass,
        baseAdultFare: adultFare,
        totalAmount: parseInt(totalSpan.innerText.replace(/[^0-9]/g, ''))
    };
    
    localStorage.setItem('passengerDetails', JSON.stringify({
        passengers: passengerDetails,
        contact: contact,
        fare: fareSelection,
        flight: flightData.flight,
        travelDate: flightData.travelDate,
        from: flightData.from,
        to: flightData.to
    }));
    
    localStorage.setItem('fareSelection', JSON.stringify(fareSelection));
    localStorage.setItem('selectedClass', selectedClass);
    localStorage.setItem('totalAmount', fareSelection.totalAmount);
    
    showToast("Passenger details saved! Redirecting to add-ons...", "success");
    
    setTimeout(() => {
        window.location.href = "addons.html";
    }, 1000);
}

// Event Listeners
if (addPassengerBtn) addPassengerBtn.addEventListener('click', addPassenger);
if (proceedBtn) proceedBtn.addEventListener('click', proceedToAddons);

// Initialize
loadFlightData();