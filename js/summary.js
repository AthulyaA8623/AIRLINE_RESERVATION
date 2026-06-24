// ========================================
// SUMMARY PAGE LOGIC
// BlueSky Airlines - Professional Implementation
// ========================================

// Load data from localStorage
let flightData = JSON.parse(localStorage.getItem('selectedFlight')) || {};
let passengerData = JSON.parse(localStorage.getItem('passengerDetails')) || {};
let seatData = JSON.parse(localStorage.getItem('selectedSeat')) || {};
let fareData = JSON.parse(localStorage.getItem('fareSelection')) || {};
let addonsData = JSON.parse(localStorage.getItem('addons')) || {};

const BASE_FARE = 4500;

// DOM Elements
const flightDetailsDiv = document.getElementById('flightDetails');
const passengerDetailsDiv = document.getElementById('passengerDetails');
const seatDetailsDiv = document.getElementById('seatDetails');
const addonsDetailsDiv = document.getElementById('addonsDetails');
const priceBreakdownDiv = document.getElementById('priceBreakdown');
const backBtn = document.getElementById('backBtn');
const proceedBtn = document.getElementById('proceedBtn');
const acceptTerms = document.getElementById('acceptTerms');
const termsLink = document.getElementById('termsLink');

// Display Flight Details
function displayFlightDetails() {
    const flight = flightData.flight || { airline: 'Air India', flightNo: 'AI202' };
    const from = flightData.from || 'New Delhi (DEL)';
    const to = flightData.to || 'Mumbai (BOM)';
    const date = flightData.travelDate ? new Date(flightData.travelDate).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
    }) : '15 April 2026';
    const departure = flightData.flight?.dept || '08:30';
    const arrival = flightData.flight?.arr || '11:45';
    const duration = flightData.flight?.duration || '3h 15m';
    
    flightDetailsDiv.innerHTML = `
        <div class="detail-row">
            <span class="detail-label"><i class="fas fa-plane"></i> Airline & Flight</span>
            <span class="detail-value">${flight.airline} (${flight.flightNo})</span>
        </div>
        <div class="detail-row">
            <span class="detail-label"><i class="fas fa-map-marker-alt"></i> Route</span>
            <span class="detail-value">${from} → ${to}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label"><i class="fas fa-calendar"></i> Date</span>
            <span class="detail-value">${date}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label"><i class="fas fa-clock"></i> Departure</span>
            <span class="detail-value">${departure}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label"><i class="fas fa-clock"></i> Arrival</span>
            <span class="detail-value">${arrival}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label"><i class="fas fa-hourglass-half"></i> Duration</span>
            <span class="detail-value">${duration}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label"><i class="fas fa-crown"></i> Class</span>
            <span class="detail-value">${fareData.class || 'Economy'}</span>
        </div>
    `;
}

// Display Passenger Details
function displayPassengerDetails() {
    const passengers = passengerData.passengers || [{ name: 'Rajesh Kumar', age: 28, gender: 'Male' }];
    const contact = passengerData.contact || { phone: '9876543210', email: 'rajesh@example.com' };
    
    let passengerHtml = '';
    passengers.forEach((p, index) => {
        passengerHtml += `
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-user"></i> Passenger ${index + 1}</span>
                <span class="detail-value">${p.name} (${p.age} yrs, ${p.gender})</span>
            </div>
        `;
    });
    
    passengerHtml += `
        <div class="detail-row">
            <span class="detail-label"><i class="fas fa-phone-alt"></i> Phone Number</span>
            <span class="detail-value">${contact.phone}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label"><i class="fas fa-envelope"></i> Email ID</span>
            <span class="detail-value">${contact.email}</span>
        </div>
    `;
    
    passengerDetailsDiv.innerHTML = passengerHtml;
}

// Display Seat Details
function displaySeatDetails() {
    if (!seatData.seatNumber) {
        seatDetailsDiv.innerHTML = `
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-chair"></i> Seat</span>
                <span class="detail-value" style="color: #e11d48;">Not selected</span>
            </div>
        `;
        return;
    }
    
    let seatTypeText = '';
    let seatTypeIcon = '';
    const letter = seatData.letter;
    
    if (letter === 'A' || letter === 'F') {
        seatTypeText = 'Window Seat';
        seatTypeIcon = '🪟';
    } else if (letter === 'C' || letter === 'D') {
        seatTypeText = 'Aisle Seat';
        seatTypeIcon = '🚶';
    } else {
        seatTypeText = 'Middle Seat';
        seatTypeIcon = '•';
    }
    
    let features = [];
    if (seatData.isExtraLegroom) features.push('Extra Legroom ⭐');
    if (seatData.isExitRow) features.push('Exit Row 🚪');
    const featuresText = features.length > 0 ? ` (${features.join(', ')})` : '';
    
    seatDetailsDiv.innerHTML = `
        <div class="detail-row">
            <span class="detail-label"><i class="fas fa-chair"></i> Seat Number</span>
            <span class="detail-value"><strong>${seatData.seatNumber}</strong>${featuresText}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label"><i class="fas fa-arrows-alt"></i> Seat Type</span>
            <span class="detail-value">${seatTypeIcon} ${seatTypeText}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label"><i class="fas fa-crown"></i> Seat Class</span>
            <span class="detail-value">${seatData.class ? seatData.class.toUpperCase() : 'Economy'} Class</span>
        </div>
        <div class="detail-row">
            <span class="detail-label"><i class="fas fa-tag"></i> Seat Price</span>
            <span class="detail-value">₹${(seatData.price || 500).toLocaleString()}</span>
        </div>
    `;
}

// Display Add-ons Details
function displayAddonsDetails() {
    let addonsHtml = '';
    let hasAddons = false;
    
    if (addonsData.meal && addonsData.meal !== 'none') {
        addonsHtml += `<div class="detail-row"><span class="detail-label">🍽️ Meal</span><span class="detail-value">${addonsData.meal === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}</span></div>`;
        hasAddons = true;
    }
    if (addonsData.extraBaggageKg > 0) {
        addonsHtml += `<div class="detail-row"><span class="detail-label">🧳 Extra Baggage</span><span class="detail-value">+${addonsData.extraBaggageKg}kg</span></div>`;
        hasAddons = true;
    }
    if (addonsData.insurance) {
        addonsHtml += `<div class="detail-row"><span class="detail-label">🛡️ Travel Insurance</span><span class="detail-value">Included</span></div>`;
        hasAddons = true;
    }
    if (addonsData.priorityBoarding) {
        addonsHtml += `<div class="detail-row"><span class="detail-label">🚪 Priority Boarding</span><span class="detail-value">Included</span></div>`;
        hasAddons = true;
    }
    if (addonsData.fastCheckin) {
        addonsHtml += `<div class="detail-row"><span class="detail-label">⚡ Fast Check-in</span><span class="detail-value">Included</span></div>`;
        hasAddons = true;
    }
    if (addonsData.wifi) {
        addonsHtml += `<div class="detail-row"><span class="detail-label">📶 In-flight Wi-Fi</span><span class="detail-value">Included</span></div>`;
        hasAddons = true;
    }
    if (addonsData.lounge) {
        addonsHtml += `<div class="detail-row"><span class="detail-label">🍸 Lounge Access</span><span class="detail-value">Included</span></div>`;
        hasAddons = true;
    }
    
    if (!hasAddons) {
        addonsHtml = `<div class="detail-row"><span class="detail-label">No add-ons selected</span><span class="detail-value">—</span></div>`;
    }
    
    addonsDetailsDiv.innerHTML = addonsHtml;
}

// Display Price Breakdown
function displayPriceBreakdown() {
    const baseFare = BASE_FARE;
    const seatPrice = seatData.price || 500;
    let addonsTotal = 0;
    
    if (addonsData.meal && addonsData.meal !== 'none') addonsTotal += 300 * (passengerData.passengers?.length || 1);
    if (addonsData.extraBaggagePrice) addonsTotal += addonsData.extraBaggagePrice;
    if (addonsData.insurance) addonsTotal += 200;
    if (addonsData.priorityBoarding) addonsTotal += 300;
    if (addonsData.fastCheckin) addonsTotal += 200;
    if (addonsData.wifi) addonsTotal += 400;
    if (addonsData.lounge) addonsTotal += 1200;
    
    const taxes = Math.round((baseFare + seatPrice + addonsTotal) * 0.05);
    const total = baseFare + seatPrice + addonsTotal + taxes;
    
    priceBreakdownDiv.innerHTML = `
        <div class="price-row">
            <span>💰 Base Fare</span>
            <span>₹${baseFare.toLocaleString()}</span>
        </div>
        <div class="price-row">
            <span>💺 Seat Fee</span>
            <span>₹${seatPrice.toLocaleString()}</span>
        </div>
        ${addonsTotal > 0 ? `<div class="price-row"><span>🎁 Add-ons</span><span>₹${addonsTotal.toLocaleString()}</span></div>` : ''}
        <div class="price-row">
            <span>📋 Taxes & Fees (5%)</span>
            <span>₹${taxes.toLocaleString()}</span>
        </div>
        <div class="price-row total">
            <span>🎫 Total Amount</span>
            <span>₹${total.toLocaleString()}</span>
        </div>
    `;
    
    localStorage.setItem('totalAmount', total);
}

// Terms Modal
function showTermsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="terms-modal">
            <h3><i class="fas fa-file-contract"></i> Terms & Conditions</h3>
            <div class="terms-content">
                <h4>1. Booking Confirmation</h4>
                <p>Your booking is confirmed only after successful payment. You will receive an e-ticket via email within 15 minutes.</p>
                <h4>2. Cancellation Policy</h4>
                <p>Cancellations made 24 hours before departure are eligible for 100% refund. Cancellations within 24 hours incur 50% charges.</p>
                <h4>3. Check-in Requirements</h4>
                <p>Passengers must carry valid government-issued ID proof. Web check-in opens 48 hours before departure.</p>
                <h4>4. Baggage Allowance</h4>
                <p>Cabin baggage: 7kg. Check-in baggage: 15kg included. Extra baggage charges apply.</p>
                <h4>5. Changes & Modifications</h4>
                <p>Changes to booking are subject to availability and applicable fees.</p>
            </div>
            <button class="close-modal-btn"><i class="fas fa-check"></i> I Understand</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.querySelector('.close-modal-btn').onclick = () => modal.remove();
}

// Enable Proceed Button
acceptTerms.addEventListener('change', () => {
    proceedBtn.disabled = !acceptTerms.checked;
});

// Terms Link
termsLink.addEventListener('click', (e) => {
    e.preventDefault();
    showTermsModal();
});

// Back Button
backBtn.addEventListener('click', () => {
    window.location.href = 'seat_selection.html';
});

// Proceed to Payment
proceedBtn.addEventListener('click', () => {
    if (!acceptTerms.checked) {
        showToast('Please accept Terms & Conditions to proceed', 'error');
        return;
    }
    
    if (!seatData.seatNumber) {
        showToast('Please select a seat first', 'error');
        return;
    }
    
    const completeBooking = {
        flight: flightData,
        passenger: passengerData,
        seat: seatData,
        fare: fareData,
        addons: addonsData,
        totalAmount: localStorage.getItem('totalAmount'),
        bookingDate: new Date().toISOString(),
        bookingReference: generateBookingReference()
    };
    localStorage.setItem('completeBooking', JSON.stringify(completeBooking));
    
    showToast('Redirecting to secure payment gateway...', 'success');
    setTimeout(() => {
        window.location.href = 'payment.html';
    }, 1000);
});

function generateBookingReference() {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = '0123456789';
    let ref = '';
    for (let i = 0; i < 2; i++) ref += letters.charAt(Math.floor(Math.random() * letters.length));
    for (let i = 0; i < 4; i++) ref += numbers.charAt(Math.floor(Math.random() * numbers.length));
    for (let i = 0; i < 2; i++) ref += letters.charAt(Math.floor(Math.random() * letters.length));
    return ref;
}

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

// Smooth scrolling for nav links
document.getElementById('homeNav')?.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
document.getElementById('passengerDetailsNav')?.addEventListener('click', (e) => { e.preventDefault(); window.location.href = "passenger_details.html"; });
document.getElementById('loginBtn')?.addEventListener('click', () => alert("Login functionality (to be connected with backend)"));
document.getElementById('signupBtn')?.addEventListener('click', () => alert("Sign Up functionality (to be connected with backend)"));

// Initialize
displayFlightDetails();
displayPassengerDetails();
displaySeatDetails();
displayAddonsDetails();
displayPriceBreakdown();