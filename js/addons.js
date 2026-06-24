// ========================================
// ADD-ONS PAGE - COMPLETE WORKING VERSION
// BlueSky Airlines - Professional Implementation
// ========================================

// Load data from localStorage
let flightData = JSON.parse(localStorage.getItem('selectedFlight')) || {};
let passengerDetails = JSON.parse(localStorage.getItem('passengerDetails')) || {};
let seatData = JSON.parse(localStorage.getItem('selectedSeat')) || { seatNumber: "Not selected", seatType: "" };
let fareSelection = JSON.parse(localStorage.getItem('fareSelection')) || { class: "economy", baseAdultFare: 4500 };

const travelClass = fareSelection.class || flightData.selectedClass || "economy";
const isBusiness = (travelClass === "business");
let baseAdultFare = fareSelection.baseAdultFare || flightData.totalPrice || 4500;
if (isBusiness) baseAdultFare = Math.round(baseAdultFare * 1.8);

let passengers = passengerDetails.passengers || [];
if (passengers.length === 0) {
    passengers = [{ name: "Guest", age: 30, gender: "Male" }];
}

function getPassengerFare(age) {
    if (age < 2) return baseAdultFare * 0.1;
    if (age < 12) return baseAdultFare * 0.75;
    return baseAdultFare;
}
let baseTotal = passengers.reduce((sum, p) => sum + getPassengerFare(p.age), 0);
const taxes = 500;

// Add-ons state
let mealChoice = "none";
let mealPrice = 0;
let extraBaggageKg = 0;
let extraBaggagePrice = 0;
let insuranceSelected = false;
let priorityBoarding = false;
let fastCheckin = false;
let specialAssist = "none";
let wifiSelected = false;
let loungeSelected = false;
let legroomSelected = false;

// DOM elements
const mealGroup = document.getElementById('mealGroup');
const mealMessageDiv = document.getElementById('mealMessage');
const baggage10 = document.getElementById('baggage10');
const baggage20 = document.getElementById('baggage20');
const insuranceChk = document.getElementById('insuranceCheck');
const priorityChk = document.getElementById('priorityBoarding');
const fastChk = document.getElementById('fastCheckin');
const specialSelect = document.getElementById('specialAssist');
const wifiChk = document.getElementById('wifiCheck');
const loungeChk = document.getElementById('loungeCheck');
const legroomChk = document.getElementById('legroomCheck');
const extraLegroomRow = document.getElementById('extraLegroomRow');

// Hide extra legroom option for Business class
if (isBusiness) {
    if (extraLegroomRow) extraLegroomRow.style.display = 'none';
}

// ========== MEAL INITIALIZATION ==========
function initMeal() {
    if (isBusiness) {
        mealGroup.innerHTML = `
            <div class="meal-btn selected" data-meal="veg">
                <i class="fas fa-leaf"></i> Veg Meal (Included)
            </div>
        `;
        mealMessageDiv.innerHTML = '<i class="fas fa-crown"></i> ✨ Business class includes complimentary gourmet meal ✨';
        mealChoice = "veg";
        mealPrice = 0;
    } else {
        mealGroup.innerHTML = `
            <div class="meal-btn" data-meal="veg">
                <i class="fas fa-leaf"></i> Veg Meal<br><span class="meal-price">+₹300</span>
            </div>
            <div class="meal-btn" data-meal="nonveg">
                <i class="fas fa-drumstick-bite"></i> Non-Veg Meal<br><span class="meal-price">+₹300</span>
            </div>
            <div class="meal-btn selected" data-meal="none">
                <i class="fas fa-times-circle"></i> No Meal<br><span class="meal-price">Free</span>
            </div>
        `;
        document.querySelectorAll('.meal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.meal-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                mealChoice = btn.dataset.meal;
                mealPrice = (mealChoice === 'veg' || mealChoice === 'nonveg') ? 300 : 0;
                updateAll();
                showToast(`${mealChoice === 'veg' ? 'Veg' : mealChoice === 'nonveg' ? 'Non-Veg' : 'No'} meal selected`, 'success');
            });
        });
    }
}

// ========== BAGGAGE ==========
function updateBaggage() {
    let price = 0, kg = 0;
    if (baggage10.checked) { price += 800; kg += 10; }
    if (baggage20.checked) { price += 1500; kg += 20; }
    extraBaggagePrice = price;
    extraBaggageKg = kg;
    updateAll();
    if (kg > 0) showToast(`+${kg}kg extra baggage added (₹${price})`, 'success');
}

baggage10.addEventListener('change', updateBaggage);
baggage20.addEventListener('change', updateBaggage);
insuranceChk.addEventListener('change', () => { 
    insuranceSelected = insuranceChk.checked; 
    updateAll();
    if (insuranceSelected) showToast('Travel insurance added', 'success');
});
priorityChk.addEventListener('change', () => { 
    priorityBoarding = priorityChk.checked; 
    updateAll();
    if (priorityBoarding) showToast('Priority boarding added', 'success');
});
fastChk.addEventListener('change', () => { 
    fastCheckin = fastChk.checked; 
    updateAll();
    if (fastCheckin) showToast('Fast check-in added', 'success');
});
specialSelect.addEventListener('change', () => { 
    specialAssist = specialSelect.value; 
    updateAll();
    if (specialAssist !== 'none') showToast('Special assistance requested', 'success');
});
wifiChk.addEventListener('change', () => { 
    wifiSelected = wifiChk.checked; 
    updateAll();
    if (wifiSelected) showToast('In-flight Wi-Fi added', 'success');
});
loungeChk.addEventListener('change', () => { 
    loungeSelected = loungeChk.checked; 
    updateAll();
    if (loungeSelected) showToast('Lounge access added', 'success');
});
legroomChk.addEventListener('change', () => { 
    legroomSelected = legroomChk.checked; 
    updateAll();
    if (legroomSelected) showToast('Extra legroom seat added', 'success');
});

// ========== UPDATE SUMMARY & PRICE ==========
function updateAll() {
    let mealCost = mealPrice * passengers.length;
    let baggageCost = extraBaggagePrice;
    let insuranceCost = insuranceSelected ? 200 : 0;
    let priorityCost = (priorityBoarding ? 300 : 0) + (fastCheckin ? 200 : 0);
    let premiumCost = (wifiSelected ? 400 : 0) + (loungeSelected ? 1200 : 0) + (legroomSelected ? 600 : 0);
    let totalAddons = mealCost + baggageCost + insuranceCost + priorityCost + premiumCost;
    let grandTotal = baseTotal + totalAddons + taxes;

    // Flight summary
    const flight = flightData.flight || { airline: "Air India", flightNo: "AI202", origin: "Chennai", dest: "Delhi", dept: "08:30", arr: "11:45" };
    const travelDate = flightData.travelDate ? new Date(flightData.travelDate).toLocaleDateString('en-IN') : "20 April 2026";
    const flightSummaryDiv = document.getElementById('flightSummary');
    if (flightSummaryDiv) {
        flightSummaryDiv.innerHTML = `
            <div class="flight-detail-row">
                <span class="detail-label">Airline</span>
                <span class="detail-value">${flight.airline} (${flight.flightNo})</span>
            </div>
            <div class="flight-detail-row">
                <span class="detail-label">Route</span>
                <span class="detail-value">${flightData.from || flight.origin} → ${flightData.to || flight.dest}</span>
            </div>
            <div class="flight-detail-row">
                <span class="detail-label">Date & Time</span>
                <span class="detail-value">${travelDate} | ${flight.dept} - ${flight.arr}</span>
            </div>
            <div class="flight-detail-row">
                <span class="detail-label">Class</span>
                <span class="detail-value">${travelClass.toUpperCase()}</span>
            </div>
        `;
    }

    // Passenger & seat summary
    let passengerHtml = '';
    passengers.forEach((p, idx) => {
        let seat = (idx === 0 && seatData.seatNumber) ? seatData.seatNumber : (idx === 1 ? "A3" : "—");
        passengerHtml += `<div class="passenger-detail-row">👤 ${p.name} (${p.age} yrs, ${p.gender}) - Seat ${seat}</div>`;
    });
    const passengerSummaryDiv = document.getElementById('passengerSummary');
    if (passengerSummaryDiv) {
        passengerSummaryDiv.innerHTML = passengerHtml || "No passengers";
    }

    // Add-ons summary
    let addonsText = [];
    if (mealChoice !== 'none') addonsText.push(`🍽️ Meal: ${mealChoice === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'} (+₹${mealCost})`);
    if (extraBaggageKg > 0) addonsText.push(`🧳 Extra Baggage: +${extraBaggageKg}kg (+₹${baggageCost})`);
    if (insuranceSelected) addonsText.push(`🛡️ Travel Insurance (+₹200)`);
    if (priorityBoarding) addonsText.push(`🚪 Priority Boarding (+₹300)`);
    if (fastCheckin) addonsText.push(`⚡ Fast Check-in (+₹200)`);
    if (wifiSelected) addonsText.push(`📶 In-flight Wi-Fi (+₹400)`);
    if (loungeSelected) addonsText.push(`🍸 Lounge Access (+₹1200)`);
    if (legroomSelected) addonsText.push(`📏 Extra Legroom (+₹600)`);
    if (specialAssist !== 'none') {
        const assistLabels = { wheelchair: '♿ Wheelchair', senior: '👴 Senior Citizen', infant: '👶 Infant Care', medical: '🏥 Medical', unaccompanied: '🧸 Unaccompanied Minor' };
        addonsText.push(`🤝 Special Assistance: ${assistLabels[specialAssist] || specialAssist}`);
    }
    
    const addonsSummaryDiv = document.getElementById('addonsSummary');
    if (addonsSummaryDiv) {
        if (addonsText.length > 0) {
            addonsSummaryDiv.innerHTML = addonsText.map(text => `<div class="addon-item">${text}</div>`).join('');
        } else {
            addonsSummaryDiv.innerHTML = '<div class="empty-addons"><i class="fas fa-plus-circle"></i> No add-ons selected yet</div>';
        }
    }

    // Price breakdown
    const priceDiv = document.getElementById('priceBreakdown');
    if (priceDiv) {
        priceDiv.innerHTML = `
            <div class="price-row">
                <span>💰 Base Fare (${passengers.length} passenger${passengers.length > 1 ? 's' : ''})</span>
                <span>₹${Math.round(baseTotal).toLocaleString()}</span>
            </div>
            ${mealCost > 0 ? `<div class="price-row"><span>🍽️ Meal</span><span>₹${mealCost.toLocaleString()}</span></div>` : ''}
            ${baggageCost > 0 ? `<div class="price-row"><span>🧳 Extra Baggage</span><span>₹${baggageCost.toLocaleString()}</span></div>` : ''}
            ${insuranceCost > 0 ? `<div class="price-row"><span>🛡️ Insurance</span><span>₹${insuranceCost.toLocaleString()}</span></div>` : ''}
            ${priorityCost > 0 ? `<div class="price-row"><span>⭐ Priority Services</span><span>₹${priorityCost.toLocaleString()}</span></div>` : ''}
            ${premiumCost > 0 ? `<div class="price-row"><span>💎 Premium Add-ons</span><span>₹${premiumCost.toLocaleString()}</span></div>` : ''}
            <div class="price-row">
                <span>📋 Taxes & Fees</span>
                <span>₹${taxes.toLocaleString()}</span>
            </div>
            <div class="price-row total">
                <span>🎫 Total Amount</span>
                <span>₹${Math.round(grandTotal).toLocaleString()}</span>
            </div>
        `;
    }

    // Save add-ons data
    const addonsData = {
        meal: mealChoice,
        mealPricePerPerson: mealPrice,
        extraBaggageKg: extraBaggageKg,
        extraBaggagePrice: extraBaggagePrice,
        insurance: insuranceSelected,
        priorityBoarding: priorityBoarding,
        fastCheckin: fastCheckin,
        specialAssistance: specialAssist,
        wifi: wifiSelected,
        lounge: loungeSelected,
        extraLegroom: legroomSelected,
        totalAddons: totalAddons,
        totalAmount: grandTotal
    };
    localStorage.setItem('addons', JSON.stringify(addonsData));
    localStorage.setItem('totalAmount', grandTotal);
}

// ========== TOAST NOTIFICATION ==========
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ========== BUTTON ACTIONS ==========
const backBtn = document.getElementById('backBtn');
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'passenger_details.html';
    });
}

const continueBtn = document.getElementById('continueBtn');
if (continueBtn) {
    continueBtn.addEventListener('click', () => {
        if (!seatData.seatNumber || seatData.seatNumber === "Not selected") {
            showToast("Please select a seat first. Go back to seat selection.", "error");
            alert("Please select a seat first. Go back to passenger details → seat selection.");
        } else {
            showToast("Add-ons saved! Redirecting to seat selection...", "success");
            setTimeout(() => {
                window.location.href = 'seat_selection.html';
            }, 800);
        }
    });
}

// ========== SMOOTH SCROLLING FOR NAV LINKS ==========
const homeNav = document.getElementById('homeNav');
const passengerDetailsNav = document.getElementById('passengerDetailsNav');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const helpButton = document.getElementById('helpButton');
const scrollTopBtn = document.getElementById('scrollTopBtn');

if (homeNav) {
    homeNav.addEventListener('click', (e) => { 
        e.preventDefault(); 
        window.scrollTo({ top: 0, behavior: "smooth" }); 
    });
}
if (passengerDetailsNav) {
    passengerDetailsNav.addEventListener('click', (e) => { 
        e.preventDefault(); 
        window.location.href = "passenger_details.html"; 
    });
}
if (loginBtn) {
    loginBtn.addEventListener('click', () => alert("Login functionality (to be connected with backend)"));
}
if (signupBtn) {
    signupBtn.addEventListener('click', () => alert("Sign Up functionality (to be connected with backend)"));
}
if (helpButton) {
    helpButton.addEventListener('click', () => {
        alert("Need help? Call +91 9876543210 or email support@bluesky.com");
    });
}
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) scrollTopBtn.classList.add('visible');
        else scrollTopBtn.classList.remove('visible');
    });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// ========== INITIALIZE ==========
initMeal();
updateAll();